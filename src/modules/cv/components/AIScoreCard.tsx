export function AIScoreCard() {
  return (
    <div className="px-6 pt-6 pb-4 flex items-center gap-4 flex-row cursor-pointer">
      <div className="relative" style={{ width: '46px', height: '46px' }}>
        <svg
          width="46"
          height="46"
          xmlns="https://www.w3.org/2000/svg"
          className="-rotate-90 -my-[23px]"
        >
          <g>
            <title>Resume completion</title>
            <circle
              className="stroke-surface-1-1"
              r="19.78"
              cy="23"
              cx="23"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            ></circle>
            <circle
              id="circle_animation"
              r="19.78"
              cy="23"
              cx="23"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              style={{
                strokeDashoffset: '34.7988',
                strokeDasharray: '124.281',
                transition: '1s ease-out',
                stroke: 'rgb(245, 158, 11)',
              }}
            ></circle>
            <text
              x="50%"
              y="-47%"
              dominantBaseline="middle"
              textAnchor="middle"
              className="rotate-90 fill-gray-900 text-base font-semibold"
            >
              72
            </text>
          </g>
        </svg>
      </div>
      <div className="flex flex-col gap-y-0.5">
        <p className="text-base leading-6-6 text-gray-900">Your Rezi Score</p>
        <p className="text-[14px] leading-5 text-gray-900">Needs improvement</p>
      </div>
    </div>
  );
}
