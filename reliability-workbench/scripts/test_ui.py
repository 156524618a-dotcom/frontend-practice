"""本地交互回归。先启动 npm run dev，再执行 python scripts/test_ui.py。

使用独立的临时浏览器上下文，不读取或改变日常浏览器的数据。
可用 WORKBENCH_URL 指定开发或构建预览地址。
"""
from pathlib import Path
import json
import os
import re
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'docs' / 'screenshots'
OUTPUT.mkdir(parents=True, exist_ok=True)
URL = os.environ.get('WORKBENCH_URL', 'http://127.0.0.1:5180/')


with sync_playwright() as p:
    browser = p.chromium.launch(channel='msedge', headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    errors = []
    warnings = []
    remote_requests = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.on('console', lambda message: errors.append(message.text) if message.type == 'error'
            else warnings.append(message.text) if message.type == 'warning' else None)
    page.on('request', lambda request: remote_requests.append(request.url)
            if request.url.startswith('http') and not request.url.startswith(('http://127.0.0.1:', 'http://localhost:')) else None)
    page.goto(URL, wait_until='networkidle')
    main = page.get_by_role('main')
    sidebar = page.get_by_role('complementary', name='项目与功能导航')
    search = page.get_by_role('textbox', name='按任务名称搜索')
    start = page.get_by_role('button', name='开始分配分析', exact=True)
    expect(main.get_by_role('heading', name='可靠性分配', exact=True)).to_be_visible()
    expect(start).to_be_disabled()
    expect(page.get_by_role('status')).to_contain_text('共 8 项任务')
    expect(main.locator('.ant-table-tbody .ant-table-row')).to_have_count(5)
    page.screenshot(path=str(OUTPUT / 'overview.png'), full_page=True)

    main.get_by_role('radio', name='选择任务：系统可靠性分配', exact=True).check()
    expect(start).to_be_enabled()
    expect(main.locator('.selection-summary')).to_contain_text('系统可靠性分配')
    start.click()
    expect(main.get_by_role('heading', name='当前任务信息')).to_be_visible()
    expect(main.locator('.detail-panel')).to_contain_text('P001')
    expect(main.locator('.detail-panel')).to_contain_text('系统模型-01')
    expect(main.locator('.detail-panel')).to_contain_text('分析工作区待接入')
    page.screenshot(path=str(OUTPUT / 'task-info.png'), full_page=True)
    page.get_by_role('button', name='返回任务总览').click()
    expect(start).to_be_enabled()
    main.locator('.ant-pagination-item-2').click()
    expect(main.locator('.ant-table-tbody .ant-table-row')).to_have_count(3)
    expect(main.locator('.ant-table-tbody')).to_contain_text('P006')
    search.fill('电源')
    expect(main.locator('.ant-table-tbody .ant-table-row')).to_have_count(1)
    expect(start).to_be_disabled()
    main.get_by_role('radio', name='选择任务：电源分系统指标分配', exact=True).focus()
    page.keyboard.press('Space')
    expect(start).to_be_enabled()
    page.screenshot(path=str(OUTPUT / 'filtered.png'), full_page=True)
    search.fill('不存在的任务')
    expect(start).to_be_disabled()
    expect(main.get_by_text('未找到匹配的任务', exact=True)).to_be_visible()
    page.screenshot(path=str(OUTPUT / 'no-results.png'), full_page=True)
    page.get_by_role('button', name='清空搜索', exact=True).click()
    expect(page.get_by_role('status')).to_contain_text('共 8 项任务')
    expect(main.locator('.ant-table-tbody .ant-table-row')).to_have_count(5)
    search.fill('  系统  ')
    expect(page.get_by_role('status')).to_contain_text('共 3 项任务')
    search.fill('')

    # 顶栏、下拉菜单与浏览器后退。
    page.get_by_role('button', name='Weibull分析', exact=True).click()
    expect(main.get_by_role('heading', name='寿命数据分析', exact=True)).to_be_visible()
    expect(main.get_by_text('寿命数据分析工作区预留')).to_be_visible()
    page.go_back(wait_until='domcontentloaded')
    expect(main.get_by_role('heading', name='可靠性分配', exact=True)).to_be_visible()
    page.get_by_role('button', name='可靠性分析模块菜单').click()
    page.locator('.ant-dropdown').get_by_role('menuitem', name='可靠性预计', exact=True).click()
    expect(main.get_by_role('heading', name='可靠性预计', exact=True)).to_be_visible()
    page.get_by_role('button', name='返回可靠性分配').click()

    sidebar.get_by_role('button', name='帮助与导航').click()
    expect(page.get_by_role('dialog', name='帮助与导航')).to_be_visible()
    page.get_by_role('button', name='知道了').click()

    def open_project(name):
        sidebar.get_by_role('button', name='打开项目', exact=True).click()
        dialog = page.get_by_role('dialog', name='打开项目', exact=True)
        dialog.get_by_role('button', name=f'打开项目：{name}', exact=True).click()
        expect(dialog).not_to_be_visible()
        expect(sidebar.locator('.current-project')).to_contain_text(name)

    open_project('机载电源可靠性分析')
    expect(page.get_by_role('status')).to_contain_text('共 2 项任务')
    expect(start).to_be_disabled()
    open_project('控制器方案评审')
    expect(main.get_by_text('当前项目暂无分配任务', exact=True)).to_be_visible()
    expect(start).to_be_disabled()
    page.screenshot(path=str(OUTPUT / 'empty-project.png'), full_page=True)

    # 新建的是项目，不是下一阶段的新建分配任务。
    sidebar.get_by_role('button', name='新建项目', exact=True).click()
    dialog = page.get_by_role('dialog', name='新建项目', exact=True)
    dialog.get_by_role('button', name='创建项目').click()
    expect(dialog.get_by_text('请输入项目名称', exact=True)).to_be_visible()
    expect(dialog.get_by_text('请输入项目编号', exact=True)).to_be_visible()
    dialog.get_by_label('项目名称', exact=True).fill('本地测试项目')
    dialog.get_by_label('项目编号', exact=True).fill('prj-001')
    dialog.get_by_role('button', name='创建项目').click()
    expect(dialog.get_by_text('项目编号已存在', exact=True)).to_be_visible()
    dialog.get_by_label('项目编号', exact=True).fill('LOCAL-TEST')
    dialog.get_by_label('项目说明', exact=True).fill('本地界面回归测试生成的临时项目')
    dialog.get_by_role('button', name='创建项目').click()
    expect(dialog).not_to_be_visible()
    expect(sidebar.locator('.current-project')).to_contain_text('本地测试项目')
    expect(main.get_by_text('当前项目暂无分配任务', exact=True)).to_be_visible()
    assert len(json.loads(page.evaluate("localStorage.getItem('reliability-workbench.projects.v1')"))) == 4
    page.reload(wait_until='networkidle')
    sidebar.get_by_role('button', name='打开项目', exact=True).click()
    expect(page.get_by_role('dialog').get_by_text('本地测试项目', exact=True)).to_be_visible()
    page.get_by_role('dialog').get_by_role('button', name=re.compile(r'取\s*消')).click()
    expect(page.get_by_role('dialog', name='打开项目', exact=True)).not_to_be_visible()

    for width, height in [(1366,768),(1440,900),(1920,1080),(1100,800)]:
        page.set_viewport_size({'width': width, 'height': height})
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), ('horizontal overflow', width)
        bounds = start.bounding_box()
        assert bounds and bounds['y'] + bounds['height'] <= height, ('start button below viewport', width, bounds)
        if width in [1366,1920]:
            page.screenshot(path=str(OUTPUT / f'overview-{width}.png'), full_page=True)

    # 存储内容损坏时恢复默认项目，不能白屏。
    page.evaluate("localStorage.setItem('reliability-workbench.projects.v1', '{broken')")
    page.reload(wait_until='networkidle')
    expect(sidebar.locator('.current-project')).to_contain_text('平台可靠性基线')
    expect(page.get_by_role('status')).to_contain_text('共 8 项任务')
    assert not errors, errors
    assert not remote_requests, remote_requests
    print(json.dumps({'result': 'passed', 'checks': ['search', 'pagination', 'single selection', 'keyboard selection',
        'start disabled state', 'task identity', 'menu routing', 'browser back', 'help', 'project isolation',
        'empty project', 'project validation', 'local persistence', 'corrupt storage recovery', 'desktop layouts',
        'no remote runtime requests'], 'warnings': warnings, 'errors': errors}, ensure_ascii=False))
    browser.close()
