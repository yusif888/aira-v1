import React from "react";
import { motion } from "framer-motion";

/**
 * Komponen aksi cepat (Quick Actions).
 *
 * @param {Object} props
 * @param {Array} props.actions - Array object aksi { label, icon, color, href }
 */
const QuickActions = ({ actions }) => {
    return (
        <div className="bg-white shadow rounded-lg">
            <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Aksi Cepat
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {actions.map((action, idx) => (
                        <motion.button
                            key={idx}
                            className="relative group bg-gray-50 p-4 rounded-lg hover:bg-blue-50 transition-colors duration-200 text-left"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center space-x-3">
                                <div
                                    className={`flex-shrink-0 p-2 rounded-lg ${action.color} group-hover:scale-110 transition-transform duration-200`}
                                >
                                    <i
                                        className={`${action.iconClass} text-white text-lg`}
                                    ></i>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {action.title}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {action.subtitle}
                                    </p>
                                </div>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QuickActions;
