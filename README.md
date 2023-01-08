# GitHub Action - Set JSON Field
This GitHub Action helps edit a JSON file and set a field value

## Usage

Add this step in your workflow file
```yaml
- name: Update my-file.json description
  uses: jossef/action-set-json-field@v2.1
  with:
    file: my-file.json
    field: description
    value: my custom data
```

### Input Variables

- `file`: File name/path to edit. e.g `package.json`
- `field`: Field to edit. Can be nested fields. e.g `version` or `metadata.scripts.build`
- `value`: Value to set. e.g. `v1.2.3`
- `parse_json`: Optional. If set to **any non-empty** value - will parse the data in `value` field to JSON


#### Example - Updating `package.json` Version


```yaml
name: Build and Release

on:
  push:
    branches: [ master ]
  pull_request:
    branches: [ master ]

env:
  GITHUB_TOKEN: ${{ github.token }}

jobs:
  build:
    name: Build and Release
    runs-on: ubuntu-latest
    steps:
    - name: Checkout code
    - uses: actions/checkout@v3
 
    - name: Gets semantic release info
      id: semantic_release_info
      uses: jossef/action-semantic-release-info@v1
      env:
        GITHUB_TOKEN: ${{ github.token }}

    - name: Build
      run: |
        npm ci --only=prod
        npm run build

    - name: Update package.json version
      uses: jossef/action-set-json-field@v2.1
      with:
        file: package.json
        field: version
        value: ${{ steps.semantic_release_info.outputs.git_tag }}
    
    - name: Commit files
      run: |
        git config --local user.email "action@github.com"
        git config --local user.name "GitHub Action"
        git add -A
        git commit -m "docs(): bumping release ${{ steps.semantic_release_info.outputs.git_tag }}"
        git tag ${{ steps.semantic_release_info.outputs.git_tag }}
        
    - name: Push changes
      uses: ad-m/github-push-action@v0.6.0
      with:
        github_token: ${{ github.token }}
        tags: true
    
    - name: Create GitHub Release
      uses: actions/create-release@v1
      env:
        GITHUB_TOKEN: ${{ github.token }}
      with:
        tag_name: ${{ steps.semantic_release_info.outputs.git_tag }}
        release_name: ${{ steps.semantic_release_info.outputs.git_tag }}
        body: ${{ steps.semantic_release_info.outputs.notes }}
        draft: false
        prerelease: false
```


## Credits
This repo was forked and modified. original - https://github.com/marketplace/actions/get-the-upload-url-for-a-release
