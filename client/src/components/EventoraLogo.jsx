const EventoraLogo = ({ size = 38, showText = true, dark = false }) => {
    const textColor = dark ? "#FCFCFA" : "#191E1C";
  
    return (
      <div className="flex items-center gap-3">
        {/* Symbol */}
        <div
          className="flex shrink-0 items-center justify-center"
          style={{
            width: size,
            height: size,
          }}
        >
          <svg
            width={size}
            height={size}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer refined shape */}
            <rect
              x="4"
              y="4"
              width="32"
              height="32"
              rx="10"
              fill="#6F8F86"
            />
  
            {/* Abstract event mark */}
            <path
              d="M13 12.5H27C28.1 12.5 29 13.4 29 14.5V25.5C29 26.6 28.1 27.5 27 27.5H13C11.9 27.5 11 26.6 11 25.5V14.5C11 13.4 11.9 12.5 13 12.5Z"
              stroke="#FCFCFA"
              strokeWidth="2"
            />
  
            {/* Central detail */}
            <path
              d="M15 19.5H25"
              stroke="#FCFCFA"
              strokeWidth="2"
              strokeLinecap="round"
            />
  
            <path
              d="M15 23H21"
              stroke="#D8C7A3"
              strokeWidth="2"
              strokeLinecap="round"
            />
  
            {/* Small star */}
            <path
              d="M27.5 8.5L28.1 10.2L29.8 10.8L28.1 11.4L27.5 13.1L26.9 11.4L25.2 10.8L26.9 10.2L27.5 8.5Z"
              fill="#D8C7A3"
            />
          </svg>
        </div>
  
        {/* Wordmark */}
        {showText && (
          <span
            className="text-[21px] font-semibold tracking-[-0.02em]"
            style={{ color: textColor }}
          >
            Eventora
          </span>
        )}
      </div>
    );
  };
  
  export default EventoraLogo;