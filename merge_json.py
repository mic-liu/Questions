import json
import os

def merge_json_files(directory):
    # 存储所有问题的列表
    all_questions = []
    
    # 获取目录中所有 Question*.json 文件
    question_files = [f for f in os.listdir(directory) if f.startswith('Question') and f.endswith('.json')]
    
    # 读取单独的问题文件
    for file_name in sorted(question_files, key=lambda x: int(''.join(filter(str.isdigit, x)))):
        file_path = os.path.join(directory, file_name)
        with open(file_path, 'r', encoding='utf-8') as f:
            question = json.load(f)
            all_questions.append(question)
    
    # 创建最终的 JSON 结构
    merged_data = {
        "questions": all_questions
    }
    
    # 保存合并后的文件
    output_path = os.path.join(directory, 'merged_questions.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(merged_data, f, ensure_ascii=False, indent=4)
    
    print(f"已成功将 {len(question_files)} 个问题文件合并到 {output_path}")

if __name__ == "__main__":
    # 指定数据目录
    data_dir = os.path.join(os.path.dirname(__file__), 'data')
    merge_json_files(data_dir)