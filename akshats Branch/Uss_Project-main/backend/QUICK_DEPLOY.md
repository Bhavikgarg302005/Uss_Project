# Quick Deployment Guide (No Root Access)

## 🚀 Deploy in 3 Steps

### Step 1: Edit Configuration

Open `deploy.config` and update with your server details:

```bash
DEPLOY_IP=192.168.2.234      # Your server IP
DEPLOY_USER=uss-lousser      # Your username
DEPLOY_PASSWORD=l4o8u5d1     # Your password (optional if using SSH keys)
```

### Step 2: Deploy

```bash
cd backend
./deploy-user.sh
```

### Step 3: Start Service

```bash
# Option 1: From your local machine
./manage-remote.sh start

# Option 2: SSH to server
ssh uss-lousser@192.168.2.234
cd ~/password-manager-backend
./run-service.sh start
```

## ✅ Done!

Your API is now running at: `http://YOUR_SERVER_IP:8000`

## 📋 Common Commands

```bash
# Check status
./manage-remote.sh status

# View logs
./manage-remote.sh logs

# Restart service
./manage-remote.sh restart

# Stop service
./manage-remote.sh stop
```

## 🔄 Deploy to Different Servers

### Deploy to Your PC

1. Find your PC's IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Create new config: `cp deploy.config deploy-pc.config`
3. Edit `deploy-pc.config` with your PC's IP and username
4. Deploy: `./deploy-user.sh deploy-pc.config`

### Deploy to Multiple Servers

Just create different config files:

```bash
./deploy-user.sh deploy-server1.config
./deploy-user.sh deploy-server2.config
./deploy-user.sh deploy-pc.config
```

## ❓ Troubleshooting

**Service won't start?**
```bash
./manage-remote.sh logs
```

**Port already in use?**
Edit `deploy.config` and change `API_PORT=8001`, then redeploy.

**Need more help?**
See `DEPLOYMENT_USER_SPACE.md` for detailed documentation.

