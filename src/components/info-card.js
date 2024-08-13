import React from 'react';

const InfoCard = ({ title, value, color }) => {
    return (
        <div className="p-4 bg-white shadow rounded-lg">
            <div className="flex justify-between items-center text-gray-600 text-sm font-medium">
                {title} <i className="fas fa-info-circle"></i>
            </div>
            <div className={`mt-2 text-2xl font-semibold ${color}`}>{value}</div>
        </div>
    );
};

export default InfoCard;
