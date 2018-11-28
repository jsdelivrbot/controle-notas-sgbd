const Aluno = require('../models/alunos.model');

// Adiciona um novo aluno caso a matrícula e o cpf não existam no banco.
exports.adicionarAluno = (req, res) => {
	let atributos = Object.keys(Aluno);

	atributos.forEach(atributo => {
		Aluno[ atributo ] = req.body[ atributo ];
	});

	let query = `INSERT INTO alunos (${atributos}) VALUES ("${Aluno.matricula}", "${Aluno.nome}", "${Aluno.cpf}", "${Aluno.email}")`;

	// console.log(query)

	conexao.query(query, (erro, resultado) => {
		if (erro) {
			res.status(500).json({ erro, mensagem: 'Erro ao adicionar aluno' });
		} else {
			res.status(200).json({ resultado, mensagem: 'Aluno adicionado com sucesso' });
		}
	});
}

// Busca todos os alunos
exports.buscarTodosAlunos = (req, res) => {
	let query = `SELECT * FROM alunos ORDER BY nome ASC`;

	conexao.query(query, (erro, resultados) => {
		if (erro) {
			res.status(500).json({ erro, mensagem: 'Erro ao buscar todos os alunos' });
		}
		res.status(200).json({ resultados, mensagem: 'Busca por todos os alunos realizada com sucesso' });
	});
}

// Busca alunos de acordo com o atributo passado na URL
// Caso nenhum atributo tenha sido passado, busca pelo possível id contido no final da URL
exports.buscarAlunoPorAtributo = (req, res) => {
	let atributo = req.params.atributo ? req.params.atributo : 'id';
	let valor = req.params.valor ? req.params.valor : req.params.atributo;
	let query = '';

	if (atributo === 'nome' || atributo === 'email') {
		query = `SELECT * FROM alunos WHERE ${atributo} like "${valor}%" ORDER BY ${atributo}`;
	} else if (atributo === 'id' || atributo === 'matricula' || atributo === 'cpf') {
		query = `SELECT * FROM alunos WHERE ${atributo} = ${valor}`;
	} else {
		query = `SELECT * FROM alunos WHERE id = ${valor}`;
	}

	// console.log(query)

	conexao.query(query, (erro, resultado) => {
		let mensagem = '';
		if (erro) {
			res.status(500).json({ erro, mensagem: `Erro ao buscar aluno por ${atributo}` });
		} else {
			if (resultado.length <= 0) {
				mensagem = 'Nenhum aluno encontrado';
			} else {
				mensagem = 'Aluno encontrado com sucesso';
			}
			res.status(200).json({ resultado, mensagem: mensagem });
		}
	});
}

// Atualiza os dados de um aluno de acordo com o id passado na URL
// TODO: verficar quais dados foram alterados antes de fazer update para evitar erro de coluna unica de CPF e matricula 
exports.atualizarAluno = (req, res) => {
	let atributos = Object.keys(Aluno);
	let query = `UPDATE alunos SET `;

	atributos.forEach((atributo, index) => {
		if (req.body[ atributo ]) {
			query += `${atributo} = "${req.body[ atributo ]}"`;
			if (index < atributos.length - 1) {
				query += ',';
			}
		}
	});

	query += ` WHERE id = ${req.params.id}`;

	// console.log(query)

	conexao.query(query, (erro, resultado) => {
		if (erro) {
			res.status(500).json({erro, mensagem: 'Erro ao atualizar aluno'});
		} else {
			res.status(200).json({resultado, mensagem: 'Aluno atualizado com sucesso'});
		}		
	});	
}

// Remove um aluno de acordo com o id passado na URL
exports.removerAluno = (req, res) => {
	let query = `DELETE FROM alunos WHERE id = ${req.params.id}`;

	// console.log(query)

	conexao.query(query, (erro, resultado) => {
		if (erro) {
			res.status(500).json({ erro, mensagem: `Erro ao excluir aluno` });
		} else {
			res.status(200).json({ resultado, mensagem: `Aluno excluído com sucesso` });
		}
	});
}