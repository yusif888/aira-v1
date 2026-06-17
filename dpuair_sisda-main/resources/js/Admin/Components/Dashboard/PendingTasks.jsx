import React from "react";
import { motion } from "framer-motion";

/**
 * Komponen daftar tugas tertunda.
 *
 * @param {Object} props
 * @param {Array} props.tasks - Array object tugas { id, title, due_date, status, priority }
 */
const PendingTasks = ({ tasks }) => {
    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
                Tugas Menunggu
            </h3>
            <div className="space-y-3">
                {tasks.map((task, idx) => (
                    <motion.div
                        key={idx}
                        className={`flex items-start space-x-3 p-3 ${task.bg} rounded-lg`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <i
                            className={`${task.icon} ${task.color} mt-0.5 text-lg`}
                        ></i>
                        <div>
                            <p className="text-sm font-medium text-gray-900">
                                {task.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {task.subtitle}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default PendingTasks;
