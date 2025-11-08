import { onMounted, onUnmounted } from 'vue';
import { useDesignStore } from '@/stores/design';

export interface Shortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  handler: () => void;
  description: string;
}

export function useKeyboardShortcuts() {
  const designStore = useDesignStore();
  const shortcuts = new Map<string, Shortcut>();

  /**
   * 注册快捷键
   */
  const registerShortcut = (shortcut: Shortcut) => {
    const key = getShortcutKey(shortcut);
    shortcuts.set(key, shortcut);
  };

  /**
   * 取消注册快捷键
   */
  const unregisterShortcut = (key: string) => {
    shortcuts.delete(key);
  };

  /**
   * 获取快捷键字符串
   */
  const getShortcutKey = (shortcut: Shortcut): string => {
    const parts: string[] = [];
    if (shortcut.ctrlKey) parts.push('Ctrl');
    if (shortcut.altKey) parts.push('Alt');
    if (shortcut.shiftKey) parts.push('Shift');
    if (shortcut.metaKey) parts.push('Meta');
    parts.push(shortcut.key.toUpperCase());
    return parts.join('+');
  };

  /**
   * 处理按键事件
   */
  const handleKeydown = (e: KeyboardEvent) => {
    // 如果在输入框中，不处理快捷键
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
      return;
    }

    // 检查是否匹配快捷键
    for (const [_, shortcut] of shortcuts) {
      if (
        e.key.toUpperCase() === shortcut.key.toUpperCase() &&
        !!e.ctrlKey === !!shortcut.ctrlKey &&
        !!e.shiftKey === !!shortcut.shiftKey &&
        !!e.altKey === !!shortcut.altKey &&
        !!e.metaKey === !!shortcut.metaKey
      ) {
        e.preventDefault();
        shortcut.handler();
        return;
      }
    }
  };

  /**
   * 初始化默认快捷键
   */
  const initDefaultShortcuts = () => {
    // 撤销 Ctrl+Z
    registerShortcut({
      key: 'z',
      ctrlKey: true,
      shiftKey: false,
      handler: () => {
        if (designStore.canUndo) {
          designStore.undo();
        }
      },
      description: '撤销'
    });

    // 重做 Ctrl+Y 或 Ctrl+Shift+Z
    registerShortcut({
      key: 'y',
      ctrlKey: true,
      shiftKey: false,
      handler: () => {
        if (designStore.canRedo) {
          designStore.redo();
        }
      },
      description: '重做'
    });

    registerShortcut({
      key: 'z',
      ctrlKey: true,
      shiftKey: true,
      handler: () => {
        if (designStore.canRedo) {
          designStore.redo();
        }
      },
      description: '重做'
    });

    // 复制 Ctrl+C
    registerShortcut({
      key: 'c',
      ctrlKey: true,
      handler: () => {
        if (designStore.selectedIds.length > 0) {
          designStore.copySelectedComponents();
        }
      },
      description: '复制'
    });

    // 粘贴 Ctrl+V
    registerShortcut({
      key: 'v',
      ctrlKey: true,
      handler: () => {
        designStore.pasteComponents();
      },
      description: '粘贴'
    });

    // 删除 Delete/Backspace
    registerShortcut({
      key: 'Delete',
      handler: () => {
        if (designStore.selectedIds.length > 0) {
          designStore.deleteSelectedComponents();
        }
      },
      description: '删除'
    });

    registerShortcut({
      key: 'Backspace',
      handler: () => {
        if (designStore.selectedIds.length > 0) {
          designStore.deleteSelectedComponents();
        }
      },
      description: '删除'
    });

    // 全选 Ctrl+A
    registerShortcut({
      key: 'a',
      ctrlKey: true,
      handler: () => {
        designStore.selectAllComponents();
      },
      description: '全选'
    });

    // 取消选择 Escape
    registerShortcut({
      key: 'Escape',
      handler: () => {
        designStore.clearSelection();
      },
      description: '取消选择'
    });

    // 保存 Ctrl+S
    registerShortcut({
      key: 's',
      ctrlKey: true,
      handler: () => {
        designStore.saveProject();
      },
      description: '保存项目'
    });
  };

  onMounted(() => {
    initDefaultShortcuts();
    document.addEventListener('keydown', handleKeydown);
  });

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown);
    shortcuts.clear();
  });

  return {
    shortcuts,
    registerShortcut,
    unregisterShortcut,
  };
}
