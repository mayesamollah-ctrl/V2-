async function createWelcomeCard({
  userName, threadName, memberCount,
  inviterName, newUserID, inviterID, threadID, api
}) {
  const W = 1200, H = 630;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  const [newUserImg, inviterImg, groupImg] = await Promise.all([
    loadProfile(newUserID, api),
    loadProfile(inviterID, api),
    getGroupImage(threadID, api)
  ]);

  const safeUser = readableText(userName);
  const safeInviter = readableText(inviterName);
  const safeGroup = readableText(threadName);

  // === PREMIUM BACKGROUND ===
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, W, H);

  // Deep gradient overlay
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, 'rgba(20, 20, 40, 0.9)');
  bgGrad.addColorStop(1, 'rgba(10, 10, 25, 0.95)');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Luxury particles
  ctx.fillStyle = 'rgba(255, 215, 100, 0.025)';
  for (let i = 0; i < 320; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    ctx.save();
    ctx.globalAlpha = Math.random() * 0.4 + 0.1;
    ctx.beginPath();
    ctx.arc(x, y, Math.random() * 1.8 + 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  const splitX = Math.round(W * 0.39);
  const PAD = 50;

  // Left Panel - Glass Effect
  ctx.fillStyle = 'rgba(15, 15, 35, 0.85)';
  ctx.fillRect(0, 0, splitX, H);

  // Glass border glow
  ctx.save();
  ctx.shadowColor = '#a78bfa';
  ctx.shadowBlur = 35;
  ctx.strokeStyle = 'rgba(167, 139, 250, 0.25)';
  ctx.lineWidth = 3;
  roundRect(ctx, 8, 8, splitX - 16, H - 16, 24);
  ctx.stroke();
  ctx.restore();

  // Vertical accent line
  const accentGrad = ctx.createLinearGradient(0, H*0.2, 0, H*0.8);
  accentGrad.addColorStop(0, 'transparent');
  accentGrad.addColorStop(0.5, '#c4b5fd');
  accentGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = accentGrad;
  ctx.fillRect(splitX - 4, 0, 3, H);

  // === NEW MEMBER SECTION ===
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = '600 18px "Segoe UI", Arial';
  ctx.fillStyle = '#c4b5fd';
  ctx.shadowColor = '#a78bfa';
  ctx.shadowBlur = 15;
  ctx.fillText('✦ NEW MEMBER ✦', splitX / 2, 58);
  ctx.restore();

  const avatarY = H / 2 - 10;
  const avatarR = 128;

  // Avatar outer glow rings
  ctx.save();
  ctx.shadowColor = '#e0bbff';
  ctx.shadowBlur = 45;
  ctx.strokeStyle = 'rgba(224, 187, 255, 0.6)';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(splitX / 2, avatarY, avatarR + 18, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Main avatar
  if (newUserImg) {
    ctx.save();
    ctx.shadowColor = '#a78bfa';
    ctx.shadowBlur = 30;
    drawCircleAvatar(ctx, newUserImg, splitX / 2, avatarY, avatarR);
    ctx.restore();
  } else {
    // Placeholder
    ctx.fillStyle = '#1f1f2e';
    ctx.beginPath();
    ctx.arc(splitX / 2, avatarY, avatarR, 0, Math.PI * 2);
    ctx.fill();
  }

  // Username
  const maxNameW = splitX - 60;
  const { text: userText, size: userSize } = fitText(ctx, safeUser, maxNameW, 42, 22);
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = `700 ${userSize}px "Segoe UI", Arial`;
  ctx.fillStyle = '#f1e8ff';
  ctx.shadowColor = 'rgba(0,0,0,0.8)';
  ctx.shadowBlur = 12;
  ctx.fillText(userText, splitX / 2, avatarY + avatarR + 68);
  ctx.restore();

  // Member count badge
  const memberText = `✦ ${ordinal(memberCount)} MEMBER ✦`;
  ctx.save();
  ctx.font = 'bold 18px "Segoe UI", Arial';
  ctx.textAlign = 'center';
  const tw = ctx.measureText(memberText).width + 50;
  const th = 42;
  const tx = splitX / 2 - tw / 2;
  const ty = avatarY + avatarR + 98;

  const badgeGrad = ctx.createLinearGradient(tx, ty, tx + tw, ty);
  badgeGrad.addColorStop(0, '#4f46e5');
  badgeGrad.addColorStop(1, '#7c3aed');

  ctx.fillStyle = badgeGrad;
  roundRect(ctx, tx, ty, tw, th, 20);
  ctx.fill();

  ctx.fillStyle = '#e0e7ff';
  ctx.fillText(memberText, splitX / 2, ty + 28);
  ctx.restore();

  // === RIGHT SIDE (Premium Section) ===
  const rightX = splitX + PAD;

  // Welcome Text
  ctx.save();
  ctx.font = '700 46px "Segoe UI", Arial';
  const welcomeGrad = ctx.createLinearGradient(rightX, 80, rightX + 520, 80);
  welcomeGrad.addColorStop(0, '#f3e8ff');
  welcomeGrad.addColorStop(0.6, '#e0bbff');
  welcomeGrad.addColorStop(1, '#c4b5fd');
  ctx.fillStyle = welcomeGrad;
  ctx.shadowColor = '#a78bfa';
  ctx.shadowBlur = 20;
  ctx.fillText("Welcome to the Family", rightX, 88);
  ctx.restore();

  // Group Info
  const groupY = 165;
  const groupAvatarSize = 92;

  if (groupImg) {
    ctx.save();
    roundRect(ctx, rightX, groupY, groupAvatarSize, groupAvatarSize, 20);
    ctx.clip();
    ctx.drawImage(groupImg, rightX, groupY, groupAvatarSize, groupAvatarSize);
    ctx.restore();

    ctx.strokeStyle = 'rgba(192, 132, 252, 0.7)';
    ctx.lineWidth = 3.5;
    roundRect(ctx, rightX, groupY, groupAvatarSize, groupAvatarSize, 20);
    ctx.stroke();
  }

  // Group Name
  const groupNameX = rightX + groupAvatarSize + 24;
  const { text: gText, size: gSize } = fitText(ctx, safeGroup, W - groupNameX - 60, 36, 20);
  ctx.save();
  ctx.font = `700 ${gSize}px "Segoe UI", Arial`;
  ctx.fillStyle = '#e9d5ff';
  ctx.shadowBlur = 8;
  ctx.fillText(gText, groupNameX, groupY + 58);
  ctx.restore();

  // Inviter Section
  const invY = groupY + groupAvatarSize + 55;
  const invR = 48;

  if (inviterImg) {
    ctx.save();
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 25;
    drawCircleAvatar(ctx, inviterImg, rightX + invR, invY + invR, invR);
    ctx.restore();
  }

  // Inviter Name
  ctx.save();
  ctx.font = '600 26px "Segoe UI", Arial';
  ctx.fillStyle = '#fed7aa';
  ctx.fillText(safeInviter, rightX + invR * 2 + 20, invY + invR + 8);
  ctx.restore();

  ctx.font = '500 13px "Segoe UI", Arial';
  ctx.fillStyle = '#c4b5fd';
  ctx.fillText("ADDED BY", rightX + invR * 2 + 20, invY + 8);

  // Footer
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = '500 17px "Segoe UI", Arial';
  const footerGrad = ctx.createLinearGradient(W/2 - 100, H - 35, W/2 + 100, H - 35);
  footerGrad.addColorStop(0, '#a5b4fc');
  footerGrad.addColorStop(1, '#e0bbff');
  ctx.fillStyle = footerGrad;
  ctx.shadowBlur = 10;
  ctx.fillText("✦ Powered by Habib • Enjoy Your Stay ✦", W/2, H - 22);
  ctx.restore();

  // Final Border
  ctx.save();
  ctx.shadowBlur = 25;
  ctx.shadowColor = '#6366f1';
  ctx.strokeStyle = 'rgba(165, 180, 252, 0.3)';
  ctx.lineWidth = 4;
  roundRect(ctx, 12, 12, W - 24, H - 24, 28);
  ctx.stroke();
  ctx.restore();

  const tempPath = path.join(__dirname, `temp_welcome_${Date.now()}.png`);
  await fs.writeFile(tempPath, canvas.toBuffer('image/png'));
  return tempPath;
    }
