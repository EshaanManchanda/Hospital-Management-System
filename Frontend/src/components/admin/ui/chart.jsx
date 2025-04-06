
import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import ResizeObserver from "resize-observer-polyfill";

const ChartContainer = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("w-full h-[200px] md:h-[300px]", className)}
    {...props}
  />
));
ChartContainer.displayName = "ChartContainer";

const Chart = React.forwardRef(
  (
    {
      className,
      type = "bar",
      data,
      options,
      width,
      height,
      theme: customTheme,
      ...props
    },
    ref
  ) => {
    const chartRef = useRef(null);
    const containerRef = useRef(null);
    const [chartInstance, setChartInstance] = useState(null);
    const { theme: systemTheme } = useTheme();
    const theme = customTheme || systemTheme;

    useEffect(() => {
      if (!chartRef.current) return;
      
      const loadChart = async () => {
        try {
          // Dynamic import for Chart.js
          const { Chart, registerables } = await import("chart.js");
          Chart.register(...registerables);
          
          // Destroy existing chart if it exists
          if (chartInstance) {
            chartInstance.destroy();
          }
          
          // Create new chart
          const ctx = chartRef.current.getContext("2d");
          
          // Default options with theme consideration
          const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                grid: {
                  color: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                },
                ticks: {
                  color: theme === "dark" ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
                },
              },
              y: {
                grid: {
                  color: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                },
                ticks: {
                  color: theme === "dark" ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
                },
              },
            },
            plugins: {
              legend: {
                labels: {
                  color: theme === "dark" ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
                },
              },
            },
          };
          
          const mergedOptions = { ...defaultOptions, ...options };
          
          const newChartInstance = new Chart(ctx, {
            type,
            data,
            options: mergedOptions,
          });
          
          setChartInstance(newChartInstance);
        } catch (error) {
          console.error("Error loading Chart.js:", error);
        }
      };
      
      loadChart();
      
      return () => {
        if (chartInstance) {
          chartInstance.destroy();
        }
      };
    }, [type, data, options, theme, chartInstance]);
    
    // Handle resize
    useEffect(() => {
      if (!containerRef.current || !chartInstance) return;
      
      const resizeObserver = new ResizeObserver(() => {
        if (chartInstance) {
          chartInstance.resize();
        }
      });
      
      resizeObserver.observe(containerRef.current);
      
      return () => {
        resizeObserver.disconnect();
      };
    }, [chartInstance]);
    
    return (
      <ChartContainer ref={containerRef} className={className} {...props}>
        <canvas
          ref={(el) => {
            chartRef.current = el;
            if (typeof ref === "function") ref(el);
            else if (ref) ref.current = el;
          }}
          width={width}
          height={height}
        />
      </ChartContainer>
    );
  }
);
Chart.displayName = "Chart";

export { Chart };
