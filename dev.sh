for dir in */ ; do
  if [ -f "$dir/package.json" ]; then
    echo "Running 'npm run dev' in $dir"
    (cd "$dir" && npm run dev)
  fi
done
