"""
Group management routes
Security: Group operations with authorization checks
"""
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_
from slowapi import Limiter
from slowapi.util import get_remote_address
from typing import List, Dict, Any
from app.database import get_db
from app.models import User, GroupMember, Password
from app.schemas import GroupMemberResponse, GroupShareRequest
from fastapi import HTTPException, status
from app.dependencies import get_current_user
from app.security import sanitize_input
from app.config import settings
from pydantic import BaseModel, Field
from sqlalchemy import delete, func

router = APIRouter(prefix="/api/groups", tags=["Groups"])
limiter = Limiter(key_func=get_remote_address)


@router.get("", response_model=List[GroupMemberResponse])
@limiter.limit(settings.RATE_LIMIT_GENERAL)
async def get_groups(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all groups for current user
    Security: Authentication required, user isolation
    """
    result = await db.execute(
        select(GroupMember).where(GroupMember.user_id == current_user.user_id)
    )
    groups = result.scalars().all()
    
    # Security: Get username for each group member
    groups_with_usernames = []
    for group in groups:
        user_result = await db.execute(
            select(User.username).where(User.user_id == group.user_id)
        )
        username = user_result.scalar_one_or_none()
        
        groups_with_usernames.append(GroupMemberResponse(
            group_name=group.group_name,
            user_id=group.user_id,
            admin_status=group.admin_status,
            password_id=group.password_id,
            username=username
        ))
    
    return groups_with_usernames


@router.get("/{group_name}/members", response_model=List[GroupMemberResponse])
@limiter.limit(settings.RATE_LIMIT_GENERAL)
async def get_group_members(
    request: Request,
    group_name: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all members of a group
    Security: Authentication required, admin check
    """
    # Security: Check if user is admin of the group
    result = await db.execute(
        select(GroupMember).where(
            and_(
                GroupMember.group_name == group_name,
                GroupMember.user_id == current_user.user_id,
                GroupMember.admin_status == True
            )
        )
    )
    admin_check = result.scalar_one_or_none()
    
    if not admin_check:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only group admins can view members"
        )
    
    # Security: Get all group members
    result = await db.execute(
        select(GroupMember).where(GroupMember.group_name == group_name)
    )
    members = result.scalars().all()
    
    members_with_usernames = []
    for member in members:
        user_result = await db.execute(
            select(User.username).where(User.user_id == member.user_id)
        )
        username = user_result.scalar_one_or_none()
        
        members_with_usernames.append(GroupMemberResponse(
            group_name=member.group_name,
            user_id=member.user_id,
            admin_status=member.admin_status,
            password_id=member.password_id,
            username=username
        ))
    
    return members_with_usernames


@router.post("/share", status_code=status.HTTP_200_OK)
@limiter.limit(settings.RATE_LIMIT_PASSWORD)
async def share_password(
    request: Request,
    share_data: GroupShareRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Share password with group members
    Security: Authentication required, admin check, password ownership check
    """
    # Security: Verify password belongs to user
    result = await db.execute(
        select(Password).where(
            and_(
                Password.password_id == share_data.password_id,
                Password.user_id == current_user.user_id
            )
        )
    )
    password = result.scalar_one_or_none()
    
    if password is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Password not found or access denied"
        )
    
    # Security: Verify user is admin of the group
    result = await db.execute(
        select(GroupMember).where(
            and_(
                GroupMember.group_name == share_data.group_name,
                GroupMember.user_id == current_user.user_id,
                GroupMember.admin_status == True
            )
        )
    )
    admin_check = result.scalar_one_or_none()
    
    if not admin_check:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only group admins can share passwords"
        )
    
    # Security: Share password with specified users
    for user_id in share_data.user_ids:
        # Security: Verify user is member of the group
        result = await db.execute(
            select(GroupMember).where(
                and_(
                    GroupMember.group_name == share_data.group_name,
                    GroupMember.user_id == user_id
                )
            )
        )
        member = result.scalar_one_or_none()
        
        if member:
            # Security: Update password_id for member
            member.password_id = share_data.password_id
        else:
            # Security: Create new group member
            new_member = GroupMember(
                group_name=share_data.group_name,
                user_id=user_id,
                admin_status=False,
                password_id=share_data.password_id
            )
            db.add(new_member)
    
    await db.commit()
    
    return {"success": True, "message": "Password shared successfully"}


@router.post("/unshare", status_code=status.HTTP_200_OK)
@limiter.limit(settings.RATE_LIMIT_PASSWORD)
async def unshare_password(
    request: Request,
    share_data: GroupShareRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Unshare password from group members
    Security: Authentication required, admin check
    """
    # Security: Verify user is admin of the group
    result = await db.execute(
        select(GroupMember).where(
            and_(
                GroupMember.group_name == share_data.group_name,
                GroupMember.user_id == current_user.user_id,
                GroupMember.admin_status == True
            )
        )
    )
    admin_check = result.scalar_one_or_none()
    
    if not admin_check:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only group admins can unshare passwords"
        )
    
    # Security: Remove password sharing for specified users
    for user_id in share_data.user_ids:
        result = await db.execute(
            select(GroupMember).where(
                and_(
                    GroupMember.group_name == share_data.group_name,
                    GroupMember.user_id == user_id,
                    GroupMember.password_id == share_data.password_id
                )
            )
        )
        member = result.scalar_one_or_none()
        
        if member:
            member.password_id = None
    
    await db.commit()
    
    return {"success": True, "message": "Password unshared successfully"}


@router.get("/shared/passwords", response_model=List[dict])
@limiter.limit(settings.RATE_LIMIT_PASSWORD)
async def get_shared_passwords(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get passwords shared with current user by group admins
    Security: Authentication required, non-admin check
    """
    # Security: Query shared passwords for non-admin users
    result = await db.execute(
        select(Password, GroupMember)
        .join(GroupMember, Password.password_id == GroupMember.password_id)
        .join(
            GroupMember,
            and_(
                GroupMember.group_name == GroupMember.group_name,
                GroupMember.admin_status == True,
                GroupMember.password_id.isnot(None)
            ),
            isouter=True
        )
        .where(
            and_(
                GroupMember.user_id == current_user.user_id,
                GroupMember.admin_status == False,
                GroupMember.password_id.isnot(None)
            )
        )
    )
    
    # Security: Simplified query for shared passwords
    result = await db.execute(
        select(Password, GroupMember.group_name)
        .join(GroupMember, Password.password_id == GroupMember.password_id)
        .where(
            and_(
                GroupMember.user_id == current_user.user_id,
                GroupMember.admin_status == False,
                GroupMember.password_id.isnot(None)
            )
        )
    )
    
    shared = result.all()
    
    return [
        {
            "password_id": p.password_id,
            "application_name": p.application_name,
            "account_user_name": p.account_user_name,
            "group_name": group_name
        }
        for p, group_name in shared
    ]


# ===== New features =====
class CreateGroupBody(BaseModel):
    group_name: str = Field(..., min_length=1, max_length=500)


@router.post("/create", status_code=status.HTTP_201_CREATED)
@limiter.limit(settings.RATE_LIMIT_GENERAL)
async def create_group(
    request: Request,
    body: CreateGroupBody,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Create a group. Creator becomes admin.
    """
    group_name = body.group_name.strip()
    if not group_name:
        raise HTTPException(status_code=400, detail="Group name required")

    # Check if creator already a member (treat as idempotent)
    result = await db.execute(
        select(GroupMember).where(
            GroupMember.group_name == group_name,
            GroupMember.user_id == current_user.user_id
        )
    )
    existing = result.scalar_one_or_none()
    if existing:
        # ensure admin
        existing.admin_status = True
        await db.commit()
        return {"success": True, "message": "Group exists; you are admin"}

    gm = GroupMember(
        group_name=group_name,
        user_id=current_user.user_id,
        admin_status=True,
        password_id=None,
    )
    db.add(gm)
    await db.commit()
    return {"success": True, "message": "Group created"}


@router.get("/list", response_model=List[Dict[str, Any]])
@limiter.limit(settings.RATE_LIMIT_GENERAL)
async def list_groups(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    List groups current user belongs to, with member counts and admin flag.
    """
    # Find groups for current user
    result = await db.execute(
        select(GroupMember.group_name, GroupMember.admin_status)
        .where(GroupMember.user_id == current_user.user_id)
    )
    entries = result.all()
    groups = []
    for group_name, is_admin in entries:
        # Count members
        count_result = await db.execute(
            select(func.count()).select_from(GroupMember).where(
                GroupMember.group_name == group_name
            )
        )
        member_count = count_result.scalar_one() or 0
        groups.append({
            "group_name": group_name,
            "member_count": int(member_count),
            "is_admin": bool(is_admin),
        })
    return groups


@router.delete("/{group_name}/members/{user_id}", status_code=status.HTTP_200_OK)
@limiter.limit(settings.RATE_LIMIT_GENERAL)
async def remove_member(
    request: Request,
    group_name: str,
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Remove a user from a group. Only admins of the group can remove.
    """
    # Check admin
    result = await db.execute(
        select(GroupMember).where(
            GroupMember.group_name == group_name,
            GroupMember.user_id == current_user.user_id,
            GroupMember.admin_status == True,
        )
    )
    admin_entry = result.scalar_one_or_none()
    if not admin_entry:
        raise HTTPException(status_code=403, detail="Only admins can remove members")

    # Prevent removing self as sole admin without replacement (simple check)
    if user_id == current_user.user_id:
        # Is there another admin?
        admin_count_res = await db.execute(
            select(func.count()).select_from(GroupMember).where(
                GroupMember.group_name == group_name,
                GroupMember.admin_status == True
            )
        )
        admin_count = admin_count_res.scalar_one() or 0
        if admin_count <= 1:
            raise HTTPException(status_code=400, detail="Cannot remove the only admin")

    # Delete member row
    await db.execute(
        delete(GroupMember).where(
            GroupMember.group_name == group_name,
            GroupMember.user_id == user_id
        )
    )
    await db.commit()
    return {"success": True, "message": "Member removed"}


class ShareAllBody(BaseModel):
    group_name: str
    password_id: int


@router.post("/share-all", status_code=status.HTTP_200_OK)
@limiter.limit(settings.RATE_LIMIT_PASSWORD)
async def share_password_to_all(
    request: Request,
    body: ShareAllBody,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Share a password with all members of a group (admin only).
    """
    # Verify ownership of password
    result = await db.execute(
        select(Password).where(
            Password.password_id == body.password_id,
            Password.user_id == current_user.user_id
        )
    )
    password = result.scalar_one_or_none()
    if not password:
        raise HTTPException(status_code=404, detail="Password not found or access denied")

    # Verify admin
    result = await db.execute(
        select(GroupMember).where(
            GroupMember.group_name == body.group_name,
            GroupMember.user_id == current_user.user_id,
            GroupMember.admin_status == True
        )
    )
    admin_entry = result.scalar_one_or_none()
    if not admin_entry:
        raise HTTPException(status_code=403, detail="Only group admins can share")

    # Assign to all members
    members_res = await db.execute(
        select(GroupMember).where(GroupMember.group_name == body.group_name)
    )
    members = members_res.scalars().all()
    for m in members:
        m.password_id = body.password_id
    await db.commit()

    return {"success": True, "message": "Password shared with all members"}

