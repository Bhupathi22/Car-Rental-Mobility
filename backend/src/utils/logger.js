const ActivityLog = require('../models/ActivityLog');

const logActivity = async ({ userId = null, userEmail = 'system', action, module, details = {}, req = null }) => {
  try {
    const ipAddress = req?.ip || req?.headers?.['x-forwarded-for'] || '127.0.0.1';
    const userAgent = req?.headers?.['user-agent'] || 'Node.js/Express';

    await ActivityLog.create({
      userId,
      userEmail,
      action,
      module,
      details,
      ipAddress,
      userAgent,
    });
  } catch (err) {
    console.error('Activity logging failed:', err.message);
  }
};

module.exports = { logActivity };
