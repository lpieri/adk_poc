"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../ui/Icon";

interface ComposerProps {
  disabled: boolean;
  onSend: (text: string) => void;
}

const Composer: React.FC<ComposerProps> = (props) => {
  const { t } = useTranslation();
  const [value, setValue] = useState<string>("");
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    props.onSend(value);
    setValue("");
  };
  return (
    <form onSubmit={handleSubmit} className="sticky bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-20 px-4 pb-3 pt-2">
      <div className="flex items-center gap-2 rounded-full border border-black/6 bg-neutral p-1.5 pl-5 shadow-sm transition-colors focus-within:border-focus">
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          aria-label={t("chat.placeholder")}
          placeholder={t("chat.placeholder")}
          enterKeyHint="send"
          className="min-w-0 flex-1 bg-transparent py-2 text-base text-sway-black outline-none placeholder:text-sway-black/30"
        />
        <button
          type="submit"
          aria-label={t("chat.send")}
          disabled={props.disabled || value.trim() === ""}
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-sway-black text-white transition-all duration-300 hover:bg-sway-black/80 active:scale-95 disabled:opacity-30"
        >
          <Icon name="send" />
        </button>
      </div>
    </form>
  );
};

export default Composer;
