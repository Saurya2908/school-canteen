// Utility to generate referral codes like "EDZ7KP9"
function generateReferralCode() {
  const prefix = 'EDZ';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let suffix = '';
  for (let i = 0; i < 5; i += 1) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return prefix + suffix;
}

module.exports = generateReferralCode;
