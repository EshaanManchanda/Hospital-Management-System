
import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/admin/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  className,
}) => {
  return (
    <Card className={cn("dashboard-card", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="statistic-label">{title}</div>
            <div className="statistic-value mt-1">{value}</div>
            
            {trend && (
              <div className="mt-2 flex items-center text-sm">
                <span
                  className={cn("font-medium", {
                    "text-green-600": trend.isPositive,
                    "text-red-600": !trend.isPositive,
                  })}
                >
                  {trend.isPositive ? "+" : ""}{trend.value}%
                </span>
                <span className="ml-1 text-gray-500">vs last month</span>
              </div>
            )}
          </div>
          
          <div className="p-2 rounded-full bg-blue-50 text-hospital-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
