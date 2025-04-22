import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import type { Row, Column } from "@tanstack/react-table";
import type { MenuResponse } from "@/services/api/api";

interface EditableCellProps {
  value: string;
  row: Row<MenuResponse>;
  column: Column<MenuResponse, unknown>;
  onSave: (
    row: Row<MenuResponse>,
    column: Column<MenuResponse, unknown>,
    value: string
  ) => void;
}

export function EditableCell({
  value: initialValue,
  row,
  column,
  onSave,
}: EditableCellProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  // 当初始值变化时更新状态
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // 点击单元格开始编辑
  const onDoubleClick = () => {
    setEditing(true);
  };

  // 保存更改
  const handleSave = () => {
    setEditing(false);
    if (value !== initialValue) {
      onSave(row, column, value);
    }
  };

  // 取消编辑
  const handleCancel = () => {
    setEditing(false);
    setValue(initialValue);
  };

  // 编辑时按下Enter保存，按下Escape取消
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  // 当进入编辑模式时聚焦输入框
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  // 如果是编辑模式，显示输入框
  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          className="h-8 w-full"
          autoFocus
        />
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleSave}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleCancel}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // 否则，显示可点击的文本
  return (
    <div
      className="cursor-pointer py-2 px-1 rounded hover:bg-muted/50 transition-colors"
      onDoubleClick={onDoubleClick}
      title="双击编辑"
    >
      {value}
    </div>
  );
}
