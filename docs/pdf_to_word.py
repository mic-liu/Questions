from pdf2docx import Converter

def convert_pdf_to_word(pdf_path, word_path):
    """
    将PDF文件转换为Word文档
    :param pdf_path: PDF文件路径
    :param word_path: 输出的Word文件路径
    """
    try:
        # 创建转换器对象
        cv = Converter(pdf_path)
        # 执行转换
        cv.convert(word_path)
        # 关闭转换器
        cv.close()
        print(f"转换完成！文件已保存为: {word_path}")
    except Exception as e:
        print(f"转换过程中发生错误: {str(e)}")

if __name__ == "__main__":
    # 定义输入PDF文件路径
    pdf_file = r"c:\Users\rspc22\LIUMC\WorkSpace\Trae\ExtractPDFImage\P_BTPA_2408-Full-File.pdf"
    # 定义输出Word文件路径
    word_file = pdf_file.replace(".pdf", ".docx")
    
    # 执行转换
    convert_pdf_to_word(pdf_file, word_file)