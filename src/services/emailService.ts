import nodemailer from 'nodemailer';

//transporter object using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',  
  auth: {
    user: process.env.EMAIL_USER, // email address
    pass: process.env.EMAIL_PASS  // email password or app password
  }
});

// Send Email Function
export const sendCheckoutEmail = async (email: string, cartProducts: any[], address: string) => {
  try {
    let productDetails = cartProducts.map((item) => {
      return `<p><strong>${item.title}</strong> - Quantity: ${item.quantity} - Price: $${item.price}</p>`;
    }).join('');

    const mailOptions = {
      from: process.env.EMAIL_USER,    
      to: email,                    
      subject: 'Order Confirmation - Thank You for Your Purchase!',
      html: `
        <h1>Order Confirmation</h1>
        <p>Thank you for shopping with us! Here are your order details:</p>
        ${productDetails}
        <p><strong>Shipping Address:</strong> ${address}</p>
        <p><strong>Total:</strong> $${cartProducts.reduce((total, item) => total + (item.price * item.quantity), 0)}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Checkout email sent successfully!');
  } catch (error) {
    console.error('Error sending checkout email:', error);
  }
};
