# Create directories
New-Item -ItemType Directory -Path "public/wllama/esm/single-thread" -Force
New-Item -ItemType Directory -Path "public/wllama/esm/multi-thread" -Force

# Get the actual path of the wllama package in pnpm
$wllamaPath = Get-ChildItem -Path "node_modules/.pnpm/@wllama+wllama@*" -Directory | Select-Object -First 1

if ($wllamaPath) {
    # First, let's check what directories actually exist
    Write-Host "Checking directory structure..."
    $basePath = "$($wllamaPath.FullName)/node_modules/@wllama/wllama"
    Get-ChildItem -Path $basePath -Recurse -Directory | ForEach-Object {
        Write-Host $_.FullName
    }

    # Try different possible paths
    $possiblePaths = @(
        "dist/esm",
        "dist",
        "esm",
        "."
    )

    $found = $false
    foreach ($path in $possiblePaths) {
        $singleThreadPath = "$basePath/$path/single-thread"
        $multiThreadPath = "$basePath/$path/multi-thread"
        
        if ((Test-Path $singleThreadPath) -and (Test-Path $multiThreadPath)) {
            Write-Host "Found wllama files in: $path"
            
            # Copy single-thread files
            Copy-Item "$singleThreadPath/*" -Destination "public/wllama/esm/single-thread/" -Force
            
            # Copy multi-thread files
            Copy-Item "$multiThreadPath/*" -Destination "public/wllama/esm/multi-thread/" -Force
            
            $found = $true
            break
        }
    }

    if ($found) {
        Write-Host "Wllama files copied successfully!"
    } else {
        Write-Error "Could not find wllama files in any expected location!"
    }
} else {
    Write-Error "Could not find wllama package in node_modules/.pnpm!"
} 