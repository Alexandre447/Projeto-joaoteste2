
Baixe os arquivos por aqui 
ou execute:
git clone https://github.com/Alexandre447/Projeto-joaoteste2.git
cd Projeto-joaoteste2

abra um terminal na pasta do projeto

execute 
docker compose build
docker compose up -d

(opcional)
docker compose ps

deve aparecer algo como
Name                           Command                  State   Ports
-------------------------------------------------------------------------------------------------
projeto-joaoteste2-mysql-1    docker-entrypoint.sh ... Up      3306/tcp
projeto-joaoteste2-backend-1  uvicorn main:app ...    Up      8000/tcp
projeto-joaoteste2-frontend-1 serve -s dist -l 3000   Up      5173/tcp

ou 
abra o docker desktop e verifique se esta lá
