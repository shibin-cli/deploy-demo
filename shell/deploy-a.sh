# deploy.sh
echo '执行 pwd'
pwd
echo '执行 git pull'
cd page-a
pnpm install
npm run build