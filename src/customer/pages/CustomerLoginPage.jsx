import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedButton from '../../shared/components/reactbits/AnimatedButton';
import './CustomerLoginPage.css';

const CustomerLoginPage = () => {
    const navigate = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');

    const handleSendOtp = (e) => {
        e.preventDefault();
        if (phoneNumber.length === 10) {
            setOtpSent(true);
        }
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        if (otp.length === 6) {
            // Mock login success
            navigate('/customer/home');
        }
    };

    return (
        <div className="login-page">
            <div className="login-header">
                <h1>SwiftServe</h1>
                <p>AI-Enhanced Dining</p>
            </div>

            <div className="login-card">
                <div className="login-image">
                    <img
                        src="https://b.zmtcdn.com/web_assets/8313a97515fcb0447d2d77c276532a511583262271.png"
                        alt="Login Banner"
                    />
                </div>

                <div className="login-form-container">
                    <h2>{otpSent ? 'OTP Verification' : 'Login'}</h2>
                    <p className="login-subtitle">
                        {otpSent
                            ? `Enter the OTP sent to +91 ${phoneNumber}`
                            : 'Enter your phone number to continue'}
                    </p>

                    {!otpSent ? (
                        <form onSubmit={handleSendOtp}>
                            <div className="input-group">
                                <span className="country-code">+91</span>
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    placeholder="Phone number"
                                    className="login-input"
                                    required
                                />
                            </div>
                            <AnimatedButton
                                variant="primary"
                                fullWidth
                                type="submit"
                                disabled={phoneNumber.length !== 10}
                            >
                                Send OTP
                            </AnimatedButton>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp}>
                            <div className="otp-container">
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="Enter 6-digit OTP"
                                    className="login-input otp-input"
                                    maxLength={6}
                                    autoFocus
                                    required
                                />
                            </div>
                            <AnimatedButton
                                variant="primary"
                                fullWidth
                                type="submit"
                                disabled={otp.length !== 6}
                            >
                                Verify & Proceed
                            </AnimatedButton>
                            <button
                                type="button"
                                className="resend-link"
                                onClick={() => setOtpSent(false)}
                            >
                                Change Phone Number
                            </button>
                        </form>
                    )}

                    <div className="login-footer">
                        <p>By continuing, you agree to our</p>
                        <div className="links">
                            <span>Terms of Service</span>
                            <span>Privacy Policy</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerLoginPage;
