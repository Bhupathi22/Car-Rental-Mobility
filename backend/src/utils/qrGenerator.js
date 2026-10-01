const QRCode = require('qrcode');

/**
 * Generate a QR code as a base64 Data URL containing the verification URL or token
 * @param {string} bookingCode - The unique booking identifier code
 * @param {string} bookingId - The MongoDB ObjectId of the booking
 * @returns {Promise<string>} Base64 data URL string
 */
const generateBookingQRCode = async (bookingCode, bookingId) => {
  try {
    const payload = JSON.stringify({
      app: 'CAR_RENTAL_MOBILITY',
      bookingCode,
      bookingId,
      verifyUrl: `/verify-booking/${bookingId}`,
      timestamp: Date.now(),
    });

    const qrDataUrl = await QRCode.toDataURL(payload, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 2,
      width: 320,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    });

    return qrDataUrl;
  } catch (err) {
    console.error('QR Code Generation Error:', err);
    throw new Error('Failed to generate verification QR code');
  }
};

module.exports = { generateBookingQRCode };
