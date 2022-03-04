import React from "react";

export const AppButton = ({
  onPress,
  title,
  disabled = false,
}: {
  onPress: () => void;
  title: string;
  disabled?: boolean;
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onPress}
      type="button"
      className="text-white disabled:bg-green-200 bg-green-700 hover:bg-green-800 focus:ring-4   font-medium rounded-md text-sm px-8 py-3 text-center"
    >
      {title}
    </button>
  );
};
