#!/usr/bin/env python3
"""
GitHub Repository Info Scraper
独立开发者仓库整理工具
支持：用户名+密码 或 Personal Access Token 认证
"""

import requests
import json
import sys
import re
from datetime import datetime
from urllib.parse import urljoin
from typing import List, Dict, Optional


class GitHubRepoScraper:
    def __init__(self, token: Optional[str] = None, username: Optional[str] = None, password: Optional[str] = None):
        """
        初始化认证方式（优先使用Token）
        """
        self.session = requests.Session()
        self.base_url = "https://api.github.com"
        self.session.headers.update({
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "GitHub-Repo-Scraper/1.0"
        })
        
        if token:
            self.session.headers["Authorization"] = f"token {token}"
            # 验证token并获取关联用户名
            self.auth_user = self._get_authenticated_user()
        elif username and password:
            self.session.auth = (username, password)
            self.auth_user = username
        else:
            self.auth_user = None
            
        
    def _get_authenticated_user(self) -> str:
        """获取Token关联的用户名"""
        resp = self.session.get(f"{self.base_url}/user")
        if resp.status_code != 200:
            raise Exception(f"Token验证失败: {resp.json().get('message', 'Unknown error')}")
        return resp.json()["login"]
    
    def _make_request(self, url: str, params: Dict = None) -> List[Dict]:
        """带分页的请求处理"""
        results = []
        page = 1
        per_page = 100  # GitHub API最大每页100条
        
        while True:
            request_params = {**(params or {}), "page": page, "per_page": per_page}
            resp = self.session.get(url, params=request_params)
            
            if resp.status_code == 403:
                # 处理速率限制
                reset_time = int(resp.headers.get('X-RateLimit-Reset', 0))
                wait_time = max(reset_time - int(datetime.now().timestamp()), 0) + 1
                print(f"[rate-limit] 达到API速率限制，等待 {wait_time} 秒...")
                import time
                time.sleep(wait_time)
                continue
                
            if resp.status_code != 200:
                raise Exception(f"请求失败 {resp.status_code}: {resp.json().get('message', 'Unknown error')}")
            
            data = resp.json()
            if isinstance(data, list):
                results.extend(data)
                if len(data) < per_page:
                    break
            else:
                return [data]
                
            page += 1
            
        return results
    
    def get_repos(self, target_username: Optional[str] = None) -> List[Dict]:
        """
        获取所有仓库列表
        如果不指定target_username，则获取Token/认证用户的仓库
        """
        if target_username:
            # 获取指定用户的公开仓库
            url = f"{self.base_url}/users/{target_username}/repos"
            params = {"sort": "created", "direction": "asc", "type": "owner"}
        elif self.auth_user:
            # 获取认证用户的所有仓库（包括私有）
            url = f"{self.base_url}/user/repos"
            params = {"sort": "created", "direction": "asc", "visibility": "all", "affiliation": "owner"}
        else:
            raise Exception("必须提供目标用户名或认证信息")
            
        return self._make_request(url, params)
    
    def get_first_commit_date(self, owner: str, repo: str) -> Optional[str]:
        """获取仓库的第一个commit时间（项目实际开始日期）"""
        try:
            # 获取所有分支
            branches_url = f"{self.base_url}/repos/{owner}/{repo}/branches"
            branches = self._make_request(branches_url)
            
            if not branches:
                return None
                
            # 通常默认分支是main或master
            default_branch = branches[0]["name"]
            
            # 获取该分支的最早commit（通过反向排序）
            commits_url = f"{self.base_url}/repos/{owner}/{repo}/commits"
            params = {"sha": default_branch, "per_page": 1}
            
            # 获取最新commit的SHA
            latest_commits = self._make_request(commits_url, params)
            if not latest_commits:
                return None
                
            # 获取总commit数（通过list接口统计）
            all_commits = self._make_request(commits_url, {"sha": default_branch})
            if all_commits:
                # 最早的commit在列表末尾（因为默认按时间倒序）
                first_commit = all_commits[-1]
                return first_commit["commit"]["committer"]["date"] or first_commit["commit"]["author"]["date"]
            return None
            
        except Exception as e:
            print(f"  [warn] 获取commit历史失败: {e}")
            return None
    
    def get_commit_count(self, owner: str, repo: str) -> int:
        """获取仓库总commit数（作为版本号概念）"""
        try:
            # 使用参与统计API获取commit数
            contrib_url = f"{self.base_url}/repos/{owner}/{repo}/contributors"
            contributors = self._make_request(contrib_url)
            
            total_commits = sum(c.get("contributions", 0) for c in contributors)
            return total_commits
            
        except Exception as e:
            # 备选方案：直接数commits（慢但准确）
            try:
                commits_url = f"{self.base_url}/repos/{owner}/{repo}/commits"
                all_commits = self._make_request(commits_url)
                return len(all_commits)
            except:
                return 0
    
    def scrape(self, target_username: Optional[str] = None) -> Dict:
        """
        主抓取逻辑
        """
        if not target_username and not self.auth_user:
            raise Exception("请提供目标用户名或认证信息")
            
        target = target_username or self.auth_user
        print(f"[info] 开始抓取用户: {target}")
        
        repos = self.get_repos(target_username)
        print(f"[info] 发现 {len(repos)} 个仓库")
        
        projects = []
        
        for idx, repo in enumerate(repos, 1):
            name = repo["name"]
            owner = repo["owner"]["login"]
            print(f"  [info] 处理 [{idx}/{len(repos)}]: {name}")
            
            # 获取第一个commit日期（生产日期）
            first_commit_date = self.get_first_commit_date(owner, name)
            
            # 获取commit总数（版本号）
            commit_count = self.get_commit_count(owner, name)
            
            # 处理topics
            topics = repo.get("topics", [])
            
            # 构建项目信息
            project = {
                "id": str(idx),  # 按创建顺序编号
                "name": name,
                "description": repo.get("description") or "",
                "website": repo.get("homepage") or "",
                "topics": topics,
                "production_date": first_commit_date,  # ISO 8601格式
                "version": str(commit_count),  # commit次数作为版本号
                "repo_url": repo["html_url"],
                "is_private": repo["private"],
                "stars": repo["stargazers_count"],
                "language": repo.get("language") or "Unknown",
                "created_at": repo["created_at"],  # GitHub创建时间（可能晚于first commit）
                "updated_at": repo["updated_at"]
            }
            
            projects.append(project)
            
        return {
            "username": target,
            "total_repos": len(projects),
            "generated_at": datetime.now().isoformat(),
            "projects": projects
        }


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description="GitHub仓库信息抓取工具")
    parser.add_argument("-u", "--username", help="GitHub用户名（抓取公开仓库）")
    parser.add_argument("-t", "--token", help="GitHub Personal Access Token（推荐）")
    parser.add_argument("--login-user", help="GitHub登录用户名（配合密码使用）")
    parser.add_argument("--login-pass", help="GitHub登录密码")
    parser.add_argument("-o", "--output", default="github_repos.json", help="输出文件名")
    parser.add_argument("--pretty", action="store_true", help="美化JSON输出")
    
    args = parser.parse_args()
    
    # 初始化
    try:
        if args.token:
            scraper = GitHubRepoScraper(token=args.token)
        elif args.login_user and args.login_pass:
            scraper = GitHubRepoScraper(username=args.login_user, password=args.login_pass)
        elif args.username:
            # 无认证，只能获取公开仓库（速率限制更严格）
            scraper = GitHubRepoScraper()
        else:
            print("❌ 错误: 请提供Token (-t) 或 用户名密码组合，或指定要抓取的用户名 (-u)")
            print("\n使用示例:")
            print("  1. 使用Token（推荐，可访问私有仓库）:")
            print("     python script.py -t ghp_xxxxxxxx -o my_repos.json")
            print("  2. 抓取其他用户的公开仓库:")
            print("     python script.py -u torvalds -o linux_repos.json")
            sys.exit(1)
            
        # 执行抓取
        result = scraper.scrape(args.username)
        
        # 保存结果
        indent = 2 if args.pretty else None
        with open(args.output, "w", encoding="utf-8") as f:
            json.dump(result, f, ensure_ascii=False, indent=indent)
            
        print(f"\n[ok] 完成！已保存到: {args.output}")
        print(f"[info] 总计: {result['total_repos']} 个仓库")
        
    except Exception as e:
        print(f"\n[error] 错误: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()