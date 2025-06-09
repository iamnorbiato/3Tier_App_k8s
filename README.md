# 🚀 Aplicação 3 Camadas no Kubernetes (Backend Node.js, Frontend React/Nginx, PostgreSQL) 🚀

Este repositório contém uma aplicação de exemplo de três camadas (Frontend, Backend, Banco de Dados) configurada para ser implantada e gerenciada no Kubernetes, utilizando Docker Desktop como ambiente local.

## 🌟 Visão Geral da Arquitetura

A aplicação é composta pelos seguintes serviços:

- **AppServer (Backend):** Uma API Node.js (Express) que se conecta ao banco de dados PostgreSQL.
- **WebServer (Frontend):** Uma aplicação React servida por Nginx, que atua como proxy reverso para o AppServer.
- **DBServer (Banco de Dados):** Um banco de dados PostgreSQL para persistência de dados.

No Kubernetes, esta arquitetura é mapeada da seguinte forma:

- **Deployments:** Gerenciam as instâncias (Pods) dos serviços (AppServer, WebServer, DBServer).
- **Services:** Fornecem nomes de DNS estáveis e roteamento de tráfego interno (ClusterIP) e externo (NodePort) para os Pods.
- **ConfigMaps:** Armazenam configurações não sensíveis (ex: configurações do Nginx, host/porta do DB para o AppServer).
- **Secrets:** Armazenam dados sensíveis (ex: credenciais do PostgreSQL).
- **PersistentVolumeClaim (PVC):** Garante a persistência dos dados do PostgreSQL.

## 🛠️ Pré-requisitos

Antes de iniciar, certifique-se de ter os seguintes softwares instalados:

- [**Docker Desktop**](https://www.docker.com/products/docker-desktop/) (com o Kubernetes habilitado e rodando)
- [**kubectl**](https://kubernetes.io/docs/tasks/tools/install-kubectl/) (a ferramenta de linha de comando do Kubernetes)
- [**Node.js e npm**](https://nodejs.org/) (para construir as aplicações Backend e Frontend)
- Opcional: [**Postman**](https://www.postman.com/downloads/) (para testar a API)
- Opcional: [**pgAdmin**](https://www.pgadmin.org/download/) ou outro cliente PostgreSQL (para conectar ao DB).

## 🚀 Configuração e Implantação

Siga os passos abaixo para implantar a aplicação no seu cluster Kubernetes local (Docker Desktop).

1.  **Clone o Repositório:**
    ```bash
    git clone [https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git](https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git) # Substitua pelo seu usuário e nome do repo
    cd SEU_REPOSITORIO # Navegue para a pasta raiz do repositório
    ```

2.  **Organização do Projeto:**
    Este repositório está organizado da seguinte forma:
    ```

		3TIER_APP_K8S
		├── backend/						# Código-fonte da aplicação Node.js (AppServer)
		│   ├── node_modules
		│   ├── sql
		│   ├── src
		│   ├── .dockerignore
		│   ├── Dockerfile
		│   ├── package-lock.json
		│   └── package.json
		├── frontend/						# Código-fonte da aplicação React (WebServer)
		│   ├── build/
		│   │   ├── static/
		│   │   │   ├── css/
		│   │   │   └── js/
		│   │   ├── asset-manifest.json
		│   │   └── index.html
		│   ├── images
		│   ├── node_modules
		│   ├── public
		│   ├── src
		│   ├── Dockerfile
		│   ├── nginx-k8s.conf
		│   ├── nginx.conf    
		│   ├── package-lock.json
		│   └── package.json
		└── k8s-manifests/					# Todos os arquivos de configuração YAML do Kubernetes
		    └── (seus arquivos YAML aqui)
    ```

3.  **Crie os Arquivos de Variáveis de Ambiente (`.env`) e o Secret do PostgreSQL:**

    * **No diretório `backend/`:** Crie os arquivos `.env.development` e `.env.production` se sua aplicação Node.js os utiliza para configuração de ambiente local (fora do K8s). Lembre-se de adicioná-los ao `.gitignore`.

    * **Crie o Secret do PostgreSQL:**
        No diretório `k8s-manifests/`, crie o arquivo `postgres-secrets.yaml` com suas credenciais do PostgreSQL. Os valores devem ser codificados em Base64.
        ```yaml
        # k8s-manifests/postgres-secrets.yaml
        apiVersion: v1
        kind: Secret
        metadata:
          name: postgres-secrets
        type: Opaque
        data:
          DB_USER: <VALOR_BASE64_DO_USUARIO>    # Ex: echo -n 'dev_user' | base64
          DB_PASSWORD: <VALOR_BASE64_DA_SENHA>  # Ex: echo -n 'dev_pass' | base64
          DB_NAME: <VALOR_BASE64_DO_NOME_DB>    # Ex: echo -n 'dev_db' | base64
        ```
        (Use `[System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes('seu_valor'))` no PowerShell ou `echo -n 'seu_valor' | base64` no Linux/WSL).

4.  **Ajustar e Construir Imagens Docker:**

    * **Ajuste o Dockerfile do Frontend:**
        Certifique-se de que o `Dockerfile` em `frontend/` **não copia nenhuma configuração Nginx** (`/etc/nginx/conf.d/default.conf` ou `nginx.conf`). A configuração será injetada via ConfigMap.
        Além disso, certifique-se de que o `Dockerfile` copia os arquivos compilados do seu React. Após rodar `npm run build` na pasta `frontend/`, ele deve copiar a pasta `build/` (ou `dist/`) para `/usr/share/nginx/html/` no container. Ex: `COPY build/ /usr/share/nginx/html/`

    * **Ajuste o Dockerfile do Backend:**
        Certifique-se de que o `Dockerfile` em `backend/` copia todo o código-fonte (`COPY . .`) e que o `CMD` ou `ENTRYPOINT` está definido para iniciar a aplicação Node.js corretamente (ex: `CMD ["npm", "start"]` ou `CMD ["node", "src/app.js"]`), **sem usar `nodemon`**.

    * **Construa as Imagens:**
        No diretório raiz do repositório (`SEU_REPOSITORIO/`):
        ```bash
        docker build -t appimage:latest ./backend
        docker build -t webimage:latest ./frontend
        # A imagem do banco de dados (postgres:15) será puxada automaticamente.
        ```

5.  **Preparação e Aplicação dos Manifestos Kubernetes:**

    * **Navegue para a pasta dos manifestos:**
        ```bash
        cd k8s-manifests/
        ```

    * **Atualize os arquivos YAML (se necessário) com os nomes de imagem `appimage:latest` e `webimage:latest`.** (Já fizemos isso ao longo do tutorial, mas é bom revisar).

    * **Garanta que o Kubernetes está habilitado e rodando no Docker Desktop.**

    * **Limpe quaisquer recursos antigos do projeto no Kubernetes (se houver):**
        ```bash
        kubectl delete -f .
        # Espere os pods terminarem: kubectl get pods
        ```

    * **Aplique todos os manifestos Kubernetes na ordem recomendada:**
        ```bash
        # Recursos de Armazenamento e Configuração/Segurança
        kubectl apply -f db-persistentvolumeclaim.yaml
        kubectl apply -f postgres-secrets.yaml
        kubectl apply -f app-config.yaml
        kubectl apply -f frontend-nginx-config.yaml

        # Services (para que os nomes DNS existam antes dos Deployments)
        kubectl apply -f db-service.yaml
        kubectl apply -f appserver-service.yaml
        kubectl apply -f webserver-service.yaml

        # Deployments
        kubectl apply -f db-deployment.yaml
        kubectl apply -f app-deployment.yaml
        kubectl apply -f web-deployment.yaml
        ```
        Você também pode usar `kubectl apply -f .` para aplicar todos de uma vez, mas a ordem explícita é boa para depuração.

    * **Verifique o status de todos os Pods e Services:**
        ```bash
        kubectl get pods
        kubectl get services
        ```
        Todos os Pods (`app-deployment`, `db-deployment`, `web-deployment`) devem estar `1/1 Running`.

## 🧪 Uso da Aplicação

Após a implantação bem-sucedida:

1.  **Acesso ao Frontend (no navegador):**
    Abra seu navegador e acesse:
    ```
    http://localhost:30080
    ```
    (A porta `30080` é definida pelo `nodePort` do `webserver-service.yaml`). Sua aplicação React deve carregar.

2.  **Acesso à API (com Postman ou similar):**
    A API do backend é acessada através do Nginx (WebServer). Se, por exemplo, você tem um endpoint `/runme-data`, a URL seria:
    ```
    http://localhost:30080/api/runme-data
    ```
    Adapte a URL para os seus endpoints de API.

3.  **Acesso Direto ao Banco de Dados (com PgAdmin ou outro cliente):**
    Para acessar o PostgreSQL do seu host:
    - **Host:** `localhost`
    - **Porta:** `30002` (definida pelo `nodePort` do `db-service.yaml`)
    - **Database, User, Password:** Conforme configurado no `postgres-secrets.yaml`.

## ⚙️ Configuração Adicional

-   **Variáveis de Ambiente:** Gerenciadas via `ConfigMaps` (para `DB_HOST`, `DB_PORT`, `PORT`) e `Secrets` (`DB_USER`, `DB_PASSWORD`, `DB_NAME`).
-   **Configuração do Nginx:** Injetada via `frontend-nginx-config.yaml` como um `ConfigMap` montado no `web-deployment`.

## 📈 Escalabilidade

Para configurar a escalabilidade horizontal automática, você pode usar o Horizontal Pod Autoscaler (HPA) após o projeto estar estável. (Esta é a próxima etapa a ser configurada).

## 🐛 Resolução de Problemas Comuns

-   **`ImagePullBackOff` ou `ErrImagePull`:**
    -   Verifique se os nomes das imagens no Deployment YAML (`appimage:latest`, `webimage:latest`) correspondem exatamente aos que você construiu localmente (`docker images`).
    -   Confirme `imagePullPolicy: Never` nos seus Deployments.
    -   Garanta que você reconstruiu as imagens após quaisquer alterações no `Dockerfile`.
-   **`CrashLoopBackOff` ou `Error` (nos Pods):**
    -   Use `kubectl describe pod <nome-do-pod>` para ver eventos e mensagens de erro.
    -   Use `kubectl logs <nome-do-pod> -c <nome-do-container>` para ver os logs da sua aplicação (AppServer) ou Nginx (WebServer). Este é o passo mais crucial.
    -   Verifique se as variáveis de ambiente estão sendo lidas corretamente pelo seu código.
    -   Confira as permissões de arquivos ou diretórios dentro do container.
-   **`502 Bad Gateway` (do Nginx):**
    -   Indica que o Nginx está funcionando, mas não consegue se comunicar com o backend (AppServer).
    -   Verifique os logs do AppServer (`kubectl logs app-deployment...`) para erros de inicialização ou conexão com o DB.
    -   Confirme que `appserver-service` é o nome correto no `frontend-nginx-config.yaml`.
-   **`no PostgreSQL user name specified in startup packet`:**
    -   Verifique se os nomes das chaves no `postgres-secrets.yaml` (ex: `DB_USER`) correspondem exatamente ao que sua aplicação Node.js (`db.js`) espera (`process.env.DB_USER`).

---

Espero que este `README.md` seja extremamente útil! Ele condensa todo o nosso processo de depuração e configuração.