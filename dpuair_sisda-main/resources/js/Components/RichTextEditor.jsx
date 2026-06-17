import React, {
    useState,
    useCallback,
    useRef,
    useEffect,
    Suspense,
} from "react";
// Lazy load ReactQuill
const ReactQuill = React.lazy(() => import("react-quill-new"));

// CSS sudah diimport melalui app.css

export default function RichTextEditor({
    value = "",
    onChange,
    placeholder = "Tulis konten Anda di sini...",
    readOnly = false,
    height = "300px",
}) {
    const quillRef = useRef(null);
    const [currentHeight, setCurrentHeight] = useState(height);
    const [isResizing, setIsResizing] = useState(false);
    const [startY, setStartY] = useState(0);
    const [startHeight, setStartHeight] = useState(0);

    // Update height when prop changes
    useEffect(() => {
        setCurrentHeight(height);
    }, [height]);

    // Handle mouse down untuk resize
    const handleMouseDown = useCallback(
        (e) => {
            console.log("Mouse down on resize handle");
            setIsResizing(true);
            setStartY(e.clientY);
            setStartHeight(parseInt(currentHeight));

            e.preventDefault();
            e.stopPropagation();
        },
        [currentHeight]
    );

    // Handle mouse move untuk resize
    const handleMouseMove = useCallback(
        (e) => {
            if (!isResizing) return;

            const deltaY = e.clientY - startY;
            const newHeight = Math.max(100, startHeight + deltaY);

            console.log("Resizing to:", newHeight, "px");
            setCurrentHeight(`${newHeight}px`);
        },
        [isResizing, startY, startHeight]
    );

    // Handle mouse up untuk resize
    const handleMouseUp = useCallback(() => {
        console.log("Mouse up, stopping resize");
        setIsResizing(false);
    }, []);

    // Add/remove event listeners based on isResizing state
    useEffect(() => {
        if (isResizing) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        } else {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isResizing, handleMouseMove, handleMouseUp]);

    // Konfigurasi toolbar yang sederhana
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ align: [] }],
            ["link", "image"],
            ["clean"],
        ],
    };

    // Konfigurasi format yang diizinkan
    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "color",
        "background",
        "list",
        "align",
        "link",
        "image",
    ];

    const EditorFallback = () => (
        <div
            style={{
                height: height,
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "1rem",
                backgroundColor: "#f9fafb",
                color: "#6c757d",
            }}
        >
            Memuat editor...
        </div>
    );

    return (
        <div
            style={{
                border: "1px solid #ccc",
                borderRadius: "4px",
                overflow: "hidden",
                position: "relative",
            }}
        >
            <Suspense fallback={<EditorFallback />}>
                <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={value}
                    onChange={onChange}
                    modules={modules}
                    formats={formats}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    style={{
                        height: currentHeight,
                    }}
                />
            </Suspense>

            {/* Simple Resize Handle */}
            <div
                onMouseDown={handleMouseDown}
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "8px",
                    background: isResizing ? "#007bff" : "#e9ecef",
                    cursor: "ns-resize",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000,
                    userSelect: "none",
                }}
                title="Drag untuk mengubah ukuran editor"
            >
                <div
                    style={{
                        width: "40px",
                        height: "3px",
                        background: isResizing ? "white" : "#6c757d",
                        borderRadius: "2px",
                    }}
                />
            </div>
        </div>
    );
}
