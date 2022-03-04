import React from "react";

export const AppButton = ({
  onPress,
  title,
}: {
  onPress: () => void;
  title: string;
}) => {
  return (
    <button
      onClick={onPress}
      type="button"
      className="text-white bg-green-700 hover:bg-green-800 focus:ring-4   font-medium rounded-md text-sm px-8 py-3 text-center"
    >
      Translate
    </button>
  );
};
