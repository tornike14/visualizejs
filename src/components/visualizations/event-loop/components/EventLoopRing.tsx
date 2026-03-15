import { cn } from "@/lib/utils";

interface EventLoopRingProps {
  loopActive: boolean;
  loopLabel: string;
}

export const EventLoopRing = ({ loopActive, loopLabel }: EventLoopRingProps) => {
  return (
    <>
      <style>{`
        .el-loop-ring {
          position: relative;
          display: flex;
          height: 84px;
          width: 84px;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          border: 3px solid #2f3b58;
          transition: border-color 0.22s ease, box-shadow 0.22s ease;
        }

        .el-loop-ring--active {
          border-color: #f472b6;
          box-shadow: 0 0 22px rgba(244, 114, 182, 0.35);
        }

        .el-loop-dot {
          position: absolute;
          top: -6px;
          left: 50%;
          height: 12px;
          width: 12px;
          margin-left: -6px;
          border-radius: 9999px;
          background: #f472b6;
          opacity: 0;
          box-shadow: 0 0 12px rgba(244, 114, 182, 0.9);
        }

        .el-loop-ring--active .el-loop-dot {
          opacity: 1;
          animation: el-orbit 1s linear infinite;
        }

        .el-loop-label {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #95a3bd;
          transition: color 0.22s ease;
        }

        .el-loop-ring--active .el-loop-label {
          color: #f9a8d4;
        }

        @keyframes el-orbit {
          from { transform: rotate(0deg) translateX(42px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(42px) rotate(-360deg); }
        }
      `}</style>
      <div
        className={cn(
          "el-loop-ring",
          loopActive && "el-loop-ring--active"
        )}
      >
        <span className="el-loop-dot" />
        <span className="el-loop-label">
          {loopLabel}
        </span>
      </div>
    </>
  );
};
