import React, { Component, HTMLAttributes } from 'react';
import classNames from 'classnames';
import { CommonProps } from '../common';
import MarkdownActions from './markdown_actions';

// @ts-ignore
import showdown from 'showdown';
// @ts-ignore
import showdownHtmlEscape from 'showdown-htmlescape';
// import { EuiText } from '../text';
import { EuiMarkdownEditorToolbar } from './markdown_editor_toolbar';
import { EuiMarkdownEditorTextArea } from './markdown_editor_text_area';
import { EuiMarkdownFormat } from './markdown_format';
import { EuiMarkdownEditorDropZone } from './markdown_editor_drop_zone';

export type EuiMarkdownEditorProps = HTMLAttributes<HTMLDivElement> &
  CommonProps & {
    /** A unique ID to attach to the textarea. If one isn't provided, a random one
     * will be generated */
    editorId?: string;
    /** A initial markdown content */
    initialValue?: string;
    /** The height of the content/preview area */
    height: number;
  };

export interface MarkdownEditorState {
  editorContent: string;
  viewMarkdownPreview: boolean;
  files: FileList | null;
}

export class EuiMarkdownEditor extends Component<
  EuiMarkdownEditorProps,
  MarkdownEditorState
> {
  converter: showdown.Converter;
  editorId: string;
  markdownActions: MarkdownActions;

  static defaultProps = {
    height: 150,
  };

  constructor(props: EuiMarkdownEditorProps) {
    super(props);

    // Instantiate Showdown (for converting markdown -> html) with options
    this.converter = new showdown.Converter({
      openLinksInNewWindow: true,
      ghMentions: false,
      backslashEscapesHTMLTags: true,
      extensions: [showdownHtmlEscape],
    });
    this.converter.setFlavor('github');

    this.state = {
      editorContent: this.props.initialValue!,
      viewMarkdownPreview: false,
      files: null,
    };

    // If an ID wasn't provided, just generate a rando
    this.editorId =
      this.props.editorId ||
      Math.random()
        .toString(35)
        .substring(2, 10);
    this.markdownActions = new MarkdownActions(this.editorId);

    this.handleMdButtonClick = this.handleMdButtonClick.bind(this);
  }

  handleMdButtonClick = (mdButtonId: string) => {
    this.markdownActions.do(mdButtonId);
  };

  onTogglePreview = (e: any) => {
    this.setState({ viewMarkdownPreview: e.target.checked });
  };

  onAttachFiles = (files: FileList | null) => {
    console.log('List of attached files -->', files);
    this.setState({
      files: files,
    });
  };

  render() {
    const { className, editorId, initialValue, height, ...rest } = this.props;

    const { viewMarkdownPreview } = this.state;

    const classes = classNames('euiMarkdownEditor', className);

    return (
      <div className={classes} {...rest}>
        <EuiMarkdownEditorToolbar
          markdownActions={this.markdownActions}
          onTogglePreview={this.onTogglePreview}
          viewMarkdownPreview={viewMarkdownPreview}
        />

        {this.state.viewMarkdownPreview ? (
          <div
            className="euiMarkdownEditor__previewContainer"
            style={{ height: `${height}px` }}>
            <EuiMarkdownFormat>{this.state.editorContent}</EuiMarkdownFormat>
          </div>
        ) : (
          <EuiMarkdownEditorDropZone>
            <EuiMarkdownEditorTextArea
              height={height}
              id={this.editorId}
              onChange={(e: any) => {
                this.setState({ editorContent: e.target.value });
              }}
              value={this.state.editorContent}
            />
          </EuiMarkdownEditorDropZone>
        )}
      </div>
    );
  }
}
