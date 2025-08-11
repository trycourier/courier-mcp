# Install root dependencies first
if [ -f "package.json" ]; then
  echo "Installing root dependencies"
  npm install
fi

# Only build the mcp package
if [ -f "mcp/package.json" ]; then
  echo "Building package in mcp"
  (cd "mcp" && npm run build)
fi

# Then, run 'npm run dev' in all packages in parallel
pids=()
for dir in */ ; do
  if [ -f "$dir/package.json" ]; then
    echo "Running 'npm run dev' in $dir"
    (cd "$dir" && npm run dev) &
    pids+=($!)
  fi
done

# Run 'npm run dev' in examples/next-latest
if [ -f "examples/next-latest/package.json" ]; then
  echo "Running 'npm run dev' in examples/next-latest"
  (cd "examples/next-latest" && npm run dev) &
  pids+=($!)
fi

# Wait for all background jobs to finish
for pid in "${pids[@]}"; do
  wait "$pid"
done
