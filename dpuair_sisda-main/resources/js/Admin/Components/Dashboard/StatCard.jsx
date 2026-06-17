import React from "react";
import { motion } from "framer-motion";

const StatCard = ({
    iconClass,
    title,
    value,
    change,
    changeType,
    subtitle,
}) => {
    const isPositive = changeType === "increase";
    const changeColor = isPositive ? "text-green-600" : "text-red-600";
    const changeIconClass = isPositive ? "fa-arrow-up" : "fa-arrow-down";

    return (
        <motion.div
            className="relative overflow-hidden bg-white rounded-lg shadow"
            whileHover={{ scale: 1.02, shadow: "0 4px 20px rgba(0,0,0,0.1)" }}
            transition={{ duration: 0.2 }}
        >
            <div className="p-5">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <motion.div
                            className="p-3 bg-blue-100 rounded-lg"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <i
                                className={`${iconClass} text-2xl text-blue-600`}
                            ></i>
                        </motion.div>
                    </div>
                    <div className="flex-1 w-0 ml-5">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                                {title}
                            </dt>
                            <dd className="flex items-baseline">
                                <motion.div
                                    className="text-2xl font-semibold text-gray-900"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {value}
                                </motion.div>
                                {change && (
                                    <div
                                        className={`ml-2 flex items-baseline text-sm font-semibold ${changeColor}`}
                                    >
                                        <i
                                            className={`fas ${changeIconClass} self-center`}
                                        ></i>
                                        <span className="ml-1">{change}</span>
                                    </div>
                                )}
                            </dd>
                            {subtitle && (
                                <dd className="mt-1 text-xs text-gray-500">
                                    {subtitle}
                                </dd>
                            )}
                        </dl>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
        </motion.div>
    );
};

export default StatCard;
