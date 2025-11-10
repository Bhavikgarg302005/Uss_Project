"""
Messages/Notifications routes
Security: Message management for trusted user requests and group invitations
"""
from fastapi import APIRouter, Depends, HTTPException, status, Request
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_
from slowapi import Limiter
from slowapi.util import get_remote_address
from typing import List, Dict, Any
from datetime import datetime
from app.database import get_db
from app.models import User
from app.dependencies import get_current_user
from app.config import settings

router = APIRouter(prefix="/api/messages", tags=["Messages"])
limiter = Limiter(key_func=get_remote_address)

# Security: In-memory message storage (in production, use database)
# This is a simplified implementation - in production, create a messages table
messages_store: Dict[int, List[Dict[str, Any]]] = {}


class TrustedUserRequestBody(BaseModel):
    target_username: str


class GroupInvitationBody(BaseModel):
    target_username: str
    group_name: str

@router.get("", response_model=List[Dict[str, Any]])
@limiter.limit(settings.RATE_LIMIT_GENERAL)
async def get_messages(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all messages for current user
    Security: Authentication required, user isolation
    """
    # Security: Get messages for current user
    user_messages = messages_store.get(current_user.user_id, [])
    
    # Security: Filter only pending messages
    pending_messages = [msg for msg in user_messages if msg.get("status") == "pending"]
    
    return pending_messages


@router.post("/trusted-user-request")
@limiter.limit(settings.RATE_LIMIT_GENERAL)
async def create_trusted_user_request(
    request: Request,
    body: TrustedUserRequestBody,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Create a trusted user request
    Security: Authentication required, user validation
    """
    # Security: Find target user
    result = await db.execute(
        select(User).where(User.username == body.target_username)
    )
    target_user = result.scalar_one_or_none()
    
    if target_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if target_user.user_id == current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot send request to yourself"
        )
    
    # Security: Create message for target user
    message = {
        "id": f"trusted_{current_user.user_id}_{datetime.utcnow().timestamp()}",
        "type": "trusted_user_request",
        "from": current_user.username,
        "fromEmail": f"{current_user.username}@example.com",
        "message": "wants to add you as a trusted user",
        "timestamp": datetime.utcnow().isoformat(),
        "status": "pending",
    }
    
    if target_user.user_id not in messages_store:
        messages_store[target_user.user_id] = []
    
    messages_store[target_user.user_id].append(message)
    
    return {"success": True, "message": "Request sent successfully"}


@router.post("/group-invitation")
@limiter.limit(settings.RATE_LIMIT_GENERAL)
async def create_group_invitation(
    request: Request,
    body: GroupInvitationBody,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Create a group invitation
    Security: Authentication required, user validation
    """
    # Security: Find target user
    result = await db.execute(
        select(User).where(User.username == body.target_username)
    )
    target_user = result.scalar_one_or_none()
    
    if target_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Security: Create message for target user
    message = {
        "id": f"group_{current_user.user_id}_{datetime.utcnow().timestamp()}",
        "type": "group_invitation",
        "from": current_user.username,
        "groupName": body.group_name,
        "message": "invited you to join the group",
        "timestamp": datetime.utcnow().isoformat(),
        "status": "pending",
    }
    
    if target_user.user_id not in messages_store:
        messages_store[target_user.user_id] = []
    
    messages_store[target_user.user_id].append(message)
    
    return {"success": True, "message": "Invitation sent successfully"}


@router.post("/{message_id}/accept")
@limiter.limit(settings.RATE_LIMIT_GENERAL)
async def accept_message(
    request: Request,
    message_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Accept a message (trusted user request or group invitation)
    Security: Authentication required, message validation
    """
    user_messages = messages_store.get(current_user.user_id, [])
    
    message = next((msg for msg in user_messages if msg.get("id") == message_id), None)
    
    if message is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    if message.get("status") != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message already processed"
        )
    
    # Security: Update message status
    message["status"] = "accepted"
    
    # TODO: Implement actual acceptance logic (add to trusted users, add to group, etc.)
    
    return {"success": True, "message": "Message accepted"}


@router.post("/{message_id}/reject")
@limiter.limit(settings.RATE_LIMIT_GENERAL)
async def reject_message(
    request: Request,
    message_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Reject a message (trusted user request or group invitation)
    Security: Authentication required, message validation
    """
    user_messages = messages_store.get(current_user.user_id, [])
    
    message = next((msg for msg in user_messages if msg.get("id") == message_id), None)
    
    if message is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    if message.get("status") != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message already processed"
        )
    
    # Security: Update message status
    message["status"] = "rejected"
    
    return {"success": True, "message": "Message rejected"}


@router.get("/count")
@limiter.limit(settings.RATE_LIMIT_GENERAL)
async def get_message_count(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get count of pending messages
    Security: Authentication required
    """
    user_messages = messages_store.get(current_user.user_id, [])
    pending_count = len([msg for msg in user_messages if msg.get("status") == "pending"])
    
    return {"count": pending_count}


