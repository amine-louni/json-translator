import React from "react";

type Props = {
  text: string | undefined;
  color?: string;
};

const AppAlert = ({ text, color = "red" }: Props) => {
  return text ? (
    <div
      className={`p-4 mb-4 text-sm text-${color}-700 bg-${color}-100 rounded-lg dark:bg-${color}-200 dark:text-${color}-800`}
      role="alert"
    >
      <span className="font-bold">Error!</span> {text}
    </div>
  ) : null;
};

export default AppAlert;
