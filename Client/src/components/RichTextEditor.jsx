import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = ({input, setInput}) => {

    const handleChane = (content) => {
        setInput({... input, description:content});
    }

    return <ReactQuill theme="snow" value={input.description} onChange={handleChane} placeholder="Describe what students will learn in this course..." />;

}

export default RichTextEditor
