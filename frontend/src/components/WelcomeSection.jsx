import { useUser } from "@clerk/clerk-react";
import { ArrowRightIcon, SparklesIcon, ZapIcon } from "lucide-react";

function WelcomeSection({ onCreateSession }) {
  const { user } = useUser();

  return (
    <div className="max-w-8xl mx-auto ">
      <div className="card bg-base-100 mt-8 w-full">
        <div className="card-body">

          {/* SAME ROW — Left (text) | Right (button) */}
          <div className="flex items-start justify-between w-full">

            {/* LEFT SIDE */}
            <div className="flex items-start gap-3">
              <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-2xl">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>

              <div>
                <h2 className="text-3xl font-black leading-none mb-1">
                  Welcome back, {user?.firstName || "there"}!
                </h2>
                <p className="text-base-content/60 text-lg">
                  Ready to level up your coding skills?
                </p>
              </div>
            </div>

            {/* RIGHT SIDE BUTTON */}
            <button
              onClick={onCreateSession}
              className="group px-8 py-4 bg-gradient-to-r from-primary to-info rounded-2xl transition-all duration-200 hover:opacity-90"
            >
              <div className="flex items-center gap-3 text-white font-bold text-md">
                <ZapIcon className="w-5 h-5" />
                <span>Create Session</span>
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default WelcomeSection;
