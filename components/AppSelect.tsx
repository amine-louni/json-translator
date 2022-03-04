import React, { useState } from "react";

type Props = {
  title: string;
  items: { key: string; value: string }[];
  callback: (object: { key: string; value: string }) => void;
};

const AppSelect = ({ title, items, callback }: Props) => {
  const [selected, setSelected] = useState<null | {
    key: string;
    value: string;
  }>(null);
  const [showList, setShowList] = useState<boolean>(false);
  return (
    <div className="relative  ">
      <button
        onClick={() => setShowList(!showList)}
        id="dropdownButton"
        data-dropdown-toggle="dropdown"
        className="w-80 m-2  text-white bg-green-700 hover:bg-green-800 font-medium rounded-md text-sm px-5 py-4 text-center inline-flex items-center  "
        type="button"
      >
        {selected ? selected.value : title}
        <svg
          className="ml-2 w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>

      <div
        id="dropdown"
        className={`${
          !showList ? "hidden" : ""
        } absolute top-8 left-0 z-10 w-44 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700`}
      >
        <ul className="py-1" aria-labelledby="dropdownButton">
          {items.map((oneItem) => (
            <li
              onClick={() => {
                setSelected(oneItem);
                setShowList(false);
                callback(oneItem);
              }}
              key={oneItem.key}
              className="cursor-pointer block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
            >
              {oneItem.value}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AppSelect;
