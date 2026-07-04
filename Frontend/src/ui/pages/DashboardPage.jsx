import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { apiService } from "../../api/apiService";

export const DashboardPage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    apiService.fetchUserStats()
      .then(data => {
        if (isMounted) {
          setDashboardData(data);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error("Error fetching stats:", err);
        if (isMounted) {
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-on-surface-variant">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
          <p className="text-sm font-bold text-on-surface-variant font-[Poppins]">Loading dashboard statistics...</p>
        </div>
      </div>
    );
  }

  // Fallback support if data structure varies
  const displayName = dashboardData?.user?.username || user?.name || "Rahul";
  const displayTargetExam = dashboardData?.user?.targetExam || user?.targetExam || "SSC CGL";
  const displayDaysLeft = dashboardData?.user?.daysLeft || user?.daysLeft || 47;
  const displayProgress = dashboardData?.user?.overallProgress !== undefined ? dashboardData.user.overallProgress : (user?.overallProgress || 34);
  const activities = dashboardData?.recentActivity || [];

  const stats = [
    {
      title: "Tests Taken",
      value: dashboardData?.stats?.testsTaken ?? 0,
      icon: "assignment",
      trend: `+${dashboardData?.stats?.testsThisWeek ?? 0} this week`,
      trendIcon: "trending_up",
      positive: true
    },
    {
      title: "Avg Score",
      value: `${dashboardData?.stats?.avgScore ?? 0}%`,
      icon: "score",
      trend: "Overall avg",
      trendIcon: "trending_up",
      positive: true
    },
    {
      title: "Accuracy",
      value: `${dashboardData?.stats?.accuracy ?? 0}%`,
      icon: "track_changes",
      trend: "Overall accuracy",
      trendIcon: "trending_up",
      positive: true
    },
    {
      title: "Global Rank",
      value: `#${dashboardData?.stats?.globalRank?.toLocaleString() ?? 1}`,
      icon: "emoji_events",
      trend: "vs all users",
      trendIcon: "trending_up",
      positive: true
    }
  ];

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1280px] mx-auto px-4 md:px-8 py-8">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-primary to-primary-container rounded-xl p-6 md:p-8 text-primary-foreground shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col justify-between items-start gap-6 max-w-2xl">
          <div>
            <h1 className="text-[32px] leading-[1.3] font-semibold mb-2 tracking-tight font-[Poppins]">
              Welcome back, {displayName}!
            </h1>
            <p className="text-[18px] leading-[1.6] text-primary-fixed-dim mb-6">
              Your {displayTargetExam} exam is in{" "}
              <span className="font-bold text-secondary-container">{displayDaysLeft} days</span>. 
              You've completed {displayProgress}% of the syllabus.
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-primary-foreground/20 rounded-full h-2 mb-6">
              <div
                className="bg-secondary-container h-2 rounded-full transition-all duration-500"
                style={{ width: `${displayProgress}%` }}
              ></div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/subjects")}
                className="bg-primary-foreground text-primary hover:bg-surface-container px-6 py-3 rounded-lg text-[14px] font-semibold tracking-[0.05em] transition-colors shadow-md active:scale-95"
              >
                Continue Practice
              </button>
              <Link
                to="/subjects"
                className="border border-primary-foreground/30 hover:bg-primary-foreground/10 text-primary-foreground px-6 py-3 rounded-lg text-[14px] font-semibold tracking-[0.05em] transition-all text-center"
              >
                View Study Plan
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute right-0 top-0 w-64 h-full opacity-10 pointer-events-none">
          <svg className="w-full h-full fill-current text-primary-foreground" viewBox="0 0 100 100">
            <circle cx="80" cy="20" r="40" />
            <rect height="60" rx="10" width="60" x="20" y="60" />
          </svg>
        </div>
      </section>

      {/* Quick Stats Row */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[14px] font-semibold tracking-[0.05em] text-on-surface-variant">{stat.title}</span>
              <span className="material-symbols-outlined text-primary">
                {stat.icon}
              </span>
            </div>
            <div className="text-[32px] leading-[1.3] font-semibold text-primary font-[Poppins]">
              {stat.value}
            </div>
            <div className={`flex items-center mt-2 text-[12px] font-medium ${stat.positive ? "text-tertiary-container" : "text-error"}`}>
              <span className="material-symbols-outlined text-[16px] mr-1">{stat.trendIcon}</span>
              <span>{stat.trend}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Two Column Layout: Recent Activity & Quick Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Activity (7 columns) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <h2 className="text-[24px] leading-[1.4] font-semibold text-primary flex items-center gap-2 font-[Poppins]">
            <span className="material-symbols-outlined text-lg">history</span>
            Recent Activity
          </h2>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 flex flex-col gap-4">
            {activities.length > 0 ? (
              <div className="flex flex-col gap-3">
                {activities.map((act, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3 rounded-lg bg-surface-container-low border border-outline-variant"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary bg-primary-fixed p-2 rounded-lg">
                        {act.type === "test" ? "assignment" : "smart_toy"}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-on-surface">{act.title}</h4>
                        <span className="text-xs text-on-surface-variant">{act.date}</span>
                      </div>
                    </div>
                    {act.score && (
                      <span className="text-sm font-extrabold text-primary bg-primary-fixed px-2.5 py-1 rounded-full">
                        {act.score}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl mb-2">assignment_late</span>
                <p className="text-sm font-medium">No tests completed yet. Start your first mock test!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick Resources (5 columns) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <h2 className="text-[24px] leading-[1.4] font-semibold text-primary flex items-center gap-2 font-[Poppins]">
            <span className="material-symbols-outlined text-lg">bolt</span>
            Quick Resources
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/subjects"
              className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 hover:shadow-md transition-all flex flex-col gap-3 group text-left"
            >
              <span className="material-symbols-outlined text-secondary bg-secondary-container/20 p-2.5 rounded-lg w-fit">
                menu_book
              </span>
              <div>
                <h4 className="text-sm font-bold text-on-surface group-hover:text-primary">
                  Subject List
                </h4>
                <p className="text-xs text-on-surface-variant mt-1">Review syllabus coverage and tests</p>
              </div>
            </Link>

            <Link
              to="/ai-tutor"
              className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 hover:shadow-md transition-all flex flex-col gap-3 group text-left"
            >
              <span className="material-symbols-outlined text-primary bg-primary-fixed p-2.5 rounded-lg w-fit">
                smart_toy
              </span>
              <div>
                <h4 className="text-sm font-bold text-on-surface group-hover:text-primary">
                  AI Tutor Chat
                </h4>
                <p className="text-xs text-on-surface-variant mt-1">Clarify HCF, algebra, or reasoning tricks</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;
