import React, { HTMLAttributes, ReactChild } from "react";

const AppContainer = ({
  children,
  className,
}: {
  children: ReactChild | ReactChild[];
  className?: string;
}) => {
  return <div className={`max-w-5xl mx-auto ${className}`}>{children}</div>;
};

export default AppContainer;
