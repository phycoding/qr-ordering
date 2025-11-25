import React from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedButton from '../shared/components/reactbits/AnimatedButton';
import Card from '../shared/components/reactbits/Card';
import './ComingSoon.css';

const ComingSoon = ({ title, description }) => {
    const navigate = useNavigate();

    return (
        <div className="coming-soon-page">
            <Card variant="elevated" className="coming-soon-card">
                <Card.Body>
                    <div className="coming-soon-content">
                        <div className="coming-soon-icon">🚧</div>
                        <h1>{title || 'Coming Soon'}</h1>
                        <p>{description || 'This feature is currently under development.'}</p>
                        <AnimatedButton
                            variant="primary"
                            onClick={() => navigate(-1)}
                        >
                            Go Back
                        </AnimatedButton>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default ComingSoon;
