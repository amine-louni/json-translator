import React from "react";

type Props = {
  text: string | undefined;
};

const AppAlert = ({ text }: Props) => {
  return text ? (
    <div
      className={`p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800`}
      role="alert"
    >
      <span className="font-bold">Error!</span> {text}
    </div>
  ) : null;
};

export default AppAlert;
