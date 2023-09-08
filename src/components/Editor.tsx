import {
  useState,
  useEffect,
  createRoot,
  createElement,
  StrictMode,
  unmountComponentAtNode,
} from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";
import { SlotFillProvider } from "@wordpress/components";
import { parse, serialize } from "@wordpress/blocks";
import { ShortcutProvider } from "@wordpress/keyboard-shortcuts";
import { doAction, applyFilters } from "@wordpress/hooks";

import "../store";
import { registerBlocks } from "../lib/blocks";
import BlockEditor from "./BlockEditor";
import Header from "./Header";
import Sidebar from "./Sidebar";
import BindInput from "../lib/bind-input";
import EditorSettings from "../interfaces/editor-settings";
import { select, dispatch, useSelect, useDispatch } from "@wordpress/data";
import defaultSettings from "../lib/default-settings";
import KeyboardShortcuts from "./KeyboardShortcuts";

export interface EditorProps {
  settings: EditorSettings;
  onChange: (value: string) => void;
  input?: HTMLInputElement | HTMLTextAreaElement;
  value?: string;
}

const Editor = ({ settings, onChange, input, value }: EditorProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { setBlocks, undo, redo } = useDispatch("block-editor");

  const { blocks, canUndo, canRedo } = useSelect((select) => {
    return {
      blocks: select("block-editor").getBlocks(),
      canUndo: select("block-editor").canUndo(),
      canRedo: select("block-editor").canRedo(),
    };
  });

  useEffect(() => {
    registerBlocks(settings.disabledCoreBlocks);

    input?.form?.addEventListener("submit", preventSubmit);

    if (settings.fetchHandler) {
      apiFetch.setFetchHandler(settings.fetchHandler);
    }

    /**
     * Cleanup
     */
    return () => {
      input?.form?.removeEventListener("submit", preventSubmit);
    };
  }, []);

  useEffect(() => {
    if (value) {
      setBlocks(parse(value));
    }
  }, [value]);

  useEffect(() => {
    onChange(serialize(blocks));
  }, [blocks]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <StrictMode>
      <SlotFillProvider>
        <ShortcutProvider>
          <div className="block-editor">
            <KeyboardShortcuts.Register />
            <KeyboardShortcuts />

            <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

            <div
              className="block-editor__content"
              style={{ height: settings.height }}
            >
              <BlockEditor
                blocks={blocks}
                onChange={setBlocks}
                undo={undo}
                redo={redo}
                canUndo={canUndo}
                canRedo={canRedo}
                settings={settings}
              />

              {sidebarOpen && <Sidebar />}
            </div>
          </div>
        </ShortcutProvider>
      </SlotFillProvider>
    </StrictMode>
  );
};

const removeEditor = (element: HTMLInputElement | HTMLTextAreaElement) => {
  dispatch("block-editor").setBlocks([]);
  dispatch("core/blocks").removeBlockTypes(
    select("core/blocks")
      .getBlockTypes()
      .map((b) => b.name)
  );

  const container = element.parentNode?.querySelector(
    ".block-editor-container"
  );
  if (container) {
    unmountComponentAtNode(container);
    container.remove();
  }
};

const initializeEditor = (
  element: HTMLInputElement | HTMLTextAreaElement,
  settings: EditorSettings = {}
) => {
  const input = new BindInput(element);

  const container = document.createElement("div");
  container.classList.add("block-editor-container");
  input.getElement().insertAdjacentElement("afterend", container);
  input.getElement().style.display = "none";

  doAction("blockEditor.beforeInit", container);

  const root = createRoot(container);
  root.render(
    <Editor
      settings={
        applyFilters("blockEditor.settings", {
          ...defaultSettings,
          ...settings,
        }) as EditorSettings
      }
      onChange={input.setValue}
      value={input.getValue() || undefined}
      input={input.element}
    />
  );

  doAction("blockEditor.afterInit", container);
};

const preventSubmit = (event: SubmitEvent) => {
  if (event.submitter?.matches(".block-editor *")) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }
};

export { initializeEditor, removeEditor, Editor };
