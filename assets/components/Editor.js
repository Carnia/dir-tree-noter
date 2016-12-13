import React, {Component} from "react";
import {connect} from "react-redux";
import Preloader from "./Preloader";
import EditorContent from "./EditorContent";
import clip from "../helpers/clip";
import creator from "../helpers/creator";

class Editor extends Component {

    constructor(props) {
        super(props);

        this.handleOptionsClick = this.handleOptionsClick.bind(this);
        this.handleCopyClick = this.handleCopyClick.bind(this);
    }

    handleOptionsClick(e) {
        this.props.handleShowOptions();
    }

    handleCopyClick(e) {
        let contentEl = this.refs.editorContent.getWrappedInstance().refs.code;
        clip.selectElementText(contentEl);

        if(clip.getSelectionText().length > 0){
            let copySuccess = clip.copySelectionText();
            clip.clearSelection();

            if(copySuccess){
                Materialize.toast("已复制", 4000);
            }else{
                Materialize.toast("不支持的浏览器", 4000);
            }
        }
    }

    render(){
        const {isLoading, isComplete} = this.props;
        var editorMain = null;

        if(isComplete){
            const {content} = this.props,
            downloadURL = creator.makeTextFile(content);
            editorMain = (
                <div className="editor-main">
                    <div className="content-container">
                        <EditorContent ref="editorContent"/>
                    </div>
                    <div className="download-container center-align">
                        <a href="javascript:" className="waves-effect waves-light btn-large btn-copy z-depth-2" onClick={this.handleCopyClick}><i className="material-icons left">description</i>复制</a>
                        <a download="dir-tree-noter.txt" href={downloadURL} className="waves-effect waves-light btn-large btn-download z-depth-2"><i className="material-icons left">play_for_work</i>下载</a>
                    </div>
                    <div className="preloader-container valign-wrapper">
                      <div className="valign">
                          { isLoading ? <Preloader /> : null }
                      </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="container editor-area">
                <div className="config-container right-align">
                    <a href="javascript:" className="waves-effect waves-light btn btn-option" onClick={this.handleOptionsClick}><i className="material-icons left">settings</i>配置</a>
                </div>
                { editorMain }
            </div>
        );
        }
    }

function mapStateToProps(state) {
    return {
        isLoading: state.upload.isLoading,
        isComplete: state.upload.isComplete,
        content: state.editor.content
    };
}

export default connect(mapStateToProps)(Editor);
