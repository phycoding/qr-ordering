import React from 'react';
import { motion } from 'framer-motion';
import './Card.css';

const Card = ({
    children,
    variant = 'default',
    hoverable = true,
    className = '',
    onClick,
    ...props
}) => {
    const variants = {
        default: 'card-default',
        elevated: 'card-elevated',
        outlined: 'card-outlined',
        gradient: 'card-gradient'
    };

    return (
        <motion.div
            className={`animated-card ${variants[variant]} ${hoverable ? 'card-hoverable' : ''} ${className}`}
            onClick={onClick}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={hoverable ? { y: -5, transition: { duration: 0.2 } } : {}}
            {...props}
        >
            {children}
        </motion.div>
    );
};

const CardHeader = ({ children, className = '' }) => (
    <div className={`card-header ${className}`}>
        {children}
    </div>
);

const CardBody = ({ children, className = '' }) => (
    <div className={`card-body ${className}`}>
        {children}
    </div>
);

const CardFooter = ({ children, className = '' }) => (
    <div className={`card-footer ${className}`}>
        {children}
    </div>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
