import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = ({input, setInput}) => {

    const handleChane = (content) => {
        setInput({... input, description:content});
    }

    return <ReactQuill theme="snow" value={input.description} onChange={handleChane} />;

}

export default RichTextEditor
