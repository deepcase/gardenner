export type GardenerimContentKind = 'code-block' | 'terminal' | 'diff-viewer' | 'revision-compare-composition' | 'article-layout' | 'search-results' | 'report-invoice' | 'content-outline' | 'markdown-viewer' | 'content-file-list' | 'file-card-composition' | 'folder-tree-composition' | 'file-browser-composition' | 'media-library-composition' | 'media-grid-composition' | 'media-details-composition' | 'file-properties' | 'storage-meter' | 'content-file-drop' | 'content-upload-queue' | 'chunk-upload' | 'upload-progress-composition' | 'failed-upload' | 'file-preview-composition' | 'document-viewer-composition' | 'pdf-viewer' | 'image-crop-composition' | 'image-annotation-composition' | 'video-player-shell' | 'audio-player-shell' | 'code-editor-shell' | 'rich-text-editor-composition' | 'markdown-editor' | 'block-editor' | 'editor-toolbar-composition' | 'find-replace' | 'content-autosave-indicator' | 'comment-thread-composition' | 'version-history-composition';
export interface GardenerimContentItem {
  key: string | number; label?: string; parent?: string | number; type?: string; size?: number;
  description?: string; src?: string; url?: string; modified?: string; disabled?: boolean;
  quantity?: number; price?: number; properties?: Record<string, string | number>;
}
export interface GardenerimContentState {
  text?: string; keys?: Array<string | number>; folder?: string; page?: number; zoom?: number; query?: string;
  sort?: 'name' | 'size' | 'modified'; view?: 'list' | 'grid' | 'split' | 'unified';
  comments?: Array<{text: string; author?: string; date?: string; resolved?: boolean}>;
  annotations?: Array<{x: number; y: number; text: string}>;
  blocks?: Array<{text: string}>; crop?: {x: number; y: number; width: number; height: number}; version?: string | number | null;
}
export interface GardenerimContentUpload {
  key: string; name: string; size: number; status: 'queued' | 'uploading' | 'success' | 'error' | 'cancelled' | 'paused';
  progress: number; chunks: number; completedChunks: number; error?: string;
}
export interface GardenerimContentSnapshot extends GardenerimContentState {
  uploads: GardenerimContentUpload[]; busy: boolean; error: string; saveStatus: 'idle' | 'dirty' | 'saving' | 'saved' | 'error';
}
export interface GardenerimContentOptions extends GardenerimContentState {
  kind: GardenerimContentKind; title?: string; labels?: Record<string,string>; items?: GardenerimContentItem[];
  loading?: boolean; empty?: boolean; error?: string; disabled?: boolean; readOnly?: boolean;
  size?: 'small' | 'medium' | 'large'; bordered?: boolean;
  showHeader?: boolean; showToolbar?: boolean; showCount?: boolean; showPagination?: boolean;
  showMetadata?: boolean; showDescriptions?: boolean; showSort?: boolean; showViewSwitcher?: boolean;
  showUploadHints?: boolean; showChunkDetails?: boolean; showCopy?: boolean;
  /** CSS pixel limits, except editorRows and columns which are integer counts. */
  editorRows?: number; maxHeight?: number; previewHeight?: number; columns?: number; thumbnailSize?: number;
  resize?: 'none' | 'vertical' | 'both';
  /** Per service call timeout in ms; defaults to 60000, zero disables the timeout. */
  serviceTimeout?: number;
  src?: string; alt?: string; type?: string; poster?: string; language?: string; before?: string; after?: string;
  pages?: Array<string | {text: string}>; pageCount?: number; pageSize?: number; thumbnails?: boolean;
  author?: string; date?: string; locale?: string; currency?: string; taxRate?: number; discount?: number;
  total?: number; used?: number; sections?: Array<{id: string; title: string; level?: number}>; smooth?: boolean;
  versions?: Array<{key: string | number; label: string; text?: string; author?: string; date?: string}>;
  multiple?: boolean; maxSelection?: number; searchable?: boolean;
  accept?: string; maxFiles?: number; maxSize?: number; chunkSize?: number; concurrency?: number;
  upload?: (file: File, context: {signal: AbortSignal; key: string; index: number; total: number; offset: number; chunk: Blob; onProgress(value: number): void}) => unknown | Promise<unknown>;
  save?: (text: string, context: {signal: AbortSignal; value: GardenerimContentSnapshot}) => unknown | Promise<unknown>;
  saveDelay?: number; maxLength?: number; preview?: boolean; spellcheck?: boolean; wrap?: boolean; lineNumbers?: boolean;
  findReplace?: boolean; caseSensitive?: boolean; actions?: Array<'bold' | 'italic' | 'heading' | 'link'>; linkUrl?: string;
  sources?: Array<{src: string; type?: string}>; preload?: 'none' | 'metadata' | 'auto'; loop?: boolean; muted?: boolean; volume?: number; playbackRate?: number;
  value?: GardenerimContentState;
}
export interface GardenerimContentInstance extends GardenerimBehaviorInstance {
  setOptions(options: Partial<GardenerimContentOptions>): GardenerimContentSnapshot | false;
  getState(): GardenerimContentSnapshot; refresh(): void; setValue(value: GardenerimContentState): boolean;
  select(key: string | number): boolean; addFiles(files: Iterable<File> | ArrayLike<File>): boolean;
  upload(keys?: string[]): Promise<boolean>; pauseUpload(): boolean; cancel(): void; save(): Promise<boolean>;
  copy(): Promise<boolean>; exportCrop(): Promise<Blob | false>; play(): Promise<boolean>; pause(): void; seek(time: number): boolean;
  format(command: 'bold' | 'italic' | 'heading' | 'link'): boolean;
  findNext(): {start: number; end: number} | false; replace(all?: boolean): boolean | {start: number; end: number}; destroy(): void;
}
