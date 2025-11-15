"""PDF loading and text extraction utilities."""
from typing import List, Dict
from pypdf import PdfReader
import io


def load_pdf_text(file_content: bytes, filename: str) -> List[Dict[str, any]]:
    """
    Load PDF and extract text with page numbers.
    
    Args:
        file_content: Raw PDF file bytes
        filename: Name of the PDF file
        
    Returns:
        List of dicts with 'text' and 'page_number' keys
    """
    pages = []
    pdf_file = io.BytesIO(file_content)
    reader = PdfReader(pdf_file)
    
    for page_num, page in enumerate(reader.pages, start=1):
        text = page.extract_text()
        if text.strip():  # Only add non-empty pages
            pages.append({
                "text": text,
                "page_number": page_num,
                "source": filename
            })
    
    return pages

