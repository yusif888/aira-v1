import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Komponen daftar aktivitas terbaru.
 *
 * @param {Object} props
 * @param {Array} props.activities - Array object aktivitas { id, user, action, item, time, type }
 */
const RecentActivity = ({ activities }) => {
    const getActivityIcon = (type) => {
        switch (type) {
            case "user":
                return "fas fa-users";
            case "document":
                return "fas fa-file-alt";
            case "news":
                return "fas fa-newspaper";
            case "system":
                return "fas fa-cog";
            default:
                return "fas fa-info-circle";
        }
    };

    const getActivityColor = (type) => {
        switch (type) {
            case "user":
                return "text-blue-600 bg-blue-100";
            case "document":
                return "text-green-600 bg-green-100";
            case "news":
                return "text-purple-600 bg-purple-100";
            case "system":
                return "text-gray-600 bg-gray-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };

    return (
        <div className="overflow-hidden bg-white shadow rounded-lg">
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                        Aktivitas Terkini
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <i className="fas fa-circle text-xs mr-1 animate-pulse"></i>{" "}
                        Live
                    </span>
                </div>
                <div className="flow-root">
                    <ul className="-mb-8">
                        <AnimatePresence>
                            {activities.map((activity, idx) => {
                                const iconClass = getActivityIcon(
                                    activity.type,
                                );
                                const colorClass = getActivityColor(
                                    activity.type,
                                );

                                return (
                                    <motion.li
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{
                                            duration: 0.3,
                                            delay: idx * 0.1,
                                        }}
                                    >
                                        <div className="relative pb-8">
                                            {idx !== activities.length - 1 && (
                                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                                            )}
                                            <div className="relative flex space-x-3">
                                                <div>
                                                    <span
                                                        className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${colorClass}`}
                                                    >
                                                        <i
                                                            className={`${iconClass} text-sm`}
                                                        ></i>
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div>
                                                        <p className="text-sm text-gray-900">
                                                            {
                                                                activity.description
                                                            }
                                                            {activity.user && (
                                                                <span className="font-medium">
                                                                    {" "}
                                                                    oleh{" "}
                                                                    {
                                                                        activity.user
                                                                    }
                                                                </span>
                                                            )}
                                                        </p>
                                                        <p className="mt-0.5 text-xs text-gray-500">
                                                            {activity.time}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.li>
                                );
                            })}
                        </AnimatePresence>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default RecentActivity;
