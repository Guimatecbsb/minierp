from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from io import BytesIO
from datetime import datetime

def criar_cabecalho():
    """Cria o estilo de cabeçalho para os relatórios"""
    styles = getSampleStyleSheet()
    
    # Estilo para título
    titulo_style = ParagraphStyle(
        'TituloCustom',
        parent=styles['Heading1'],
        fontSize=18,
        textColor=colors.HexColor('#3B82F6'),
        spaceAfter=10,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    # Estilo para subtítulo
    subtitulo_style = ParagraphStyle(
        'SubtituloCustom',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.grey,
        spaceAfter=20,
        alignment=TA_CENTER
    )
    
    return titulo_style, subtitulo_style

def gerar_pdf_clientes(clientes_data):
    """Gera PDF com lista de clientes"""
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=2*cm, bottomMargin=2*cm)
    elements = []
    
    # Estilos
    titulo_style, subtitulo_style = criar_cabecalho()
    
    # Cabeçalho
    elements.append(Paragraph("JB Estruturas e Eventos", titulo_style))
    elements.append(Paragraph(f"Relatório de Clientes - {datetime.now().strftime('%d/%m/%Y %H:%M')}", subtitulo_style))
    elements.append(Spacer(1, 0.5*cm))
    
    # Dados da tabela
    data = [['Código', 'Nome', 'CPF/CNPJ', 'Email', 'Telefone']]
    
    for cliente in clientes_data:
        data.append([
            cliente.get('codigo_cadastro', '-'),
            cliente.get('nome', '-'),
            cliente.get('cpf_cnpj', '-'),
            cliente.get('email', '-') or '-',
            cliente.get('telefone', '-') or '-'
        ])
    
    # Criar tabela
    table = Table(data, colWidths=[3*cm, 5*cm, 3.5*cm, 4*cm, 3*cm])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3B82F6')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.white),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('FONTSIZE', (0, 1), (-1, -1), 8),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F3F4F6')])
    ]))
    
    elements.append(table)
    elements.append(Spacer(1, 0.5*cm))
    elements.append(Paragraph(f"Total de clientes: {len(clientes_data)}", subtitulo_style))
    
    doc.build(elements)
    buffer.seek(0)
    return buffer

def gerar_pdf_veiculos(veiculos_data):
    """Gera PDF com lista de veículos"""
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=2*cm, bottomMargin=2*cm)
    elements = []
    
    titulo_style, subtitulo_style = criar_cabecalho()
    
    elements.append(Paragraph("JB Estruturas e Eventos", titulo_style))
    elements.append(Paragraph(f"Relatório de Veículos - {datetime.now().strftime('%d/%m/%Y %H:%M')}", subtitulo_style))
    elements.append(Spacer(1, 0.5*cm))
    
    data = [['Placa', 'Tipo', 'Marca', 'Modelo', 'Ano', 'KM Atual', 'Status']]
    
    for veiculo in veiculos_data:
        data.append([
            veiculo.get('placa', '-'),
            veiculo.get('tipo', '-').upper(),
            veiculo.get('marca', '-'),
            veiculo.get('modelo', '-'),
            str(veiculo.get('ano', '-')),
            f"{veiculo.get('km_atual', 0):,} km",
            veiculo.get('status', '-')
        ])
    
    table = Table(data, colWidths=[2.5*cm, 2*cm, 3*cm, 3*cm, 2*cm, 2.5*cm, 2.5*cm])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3B82F6')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.white),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('FONTSIZE', (0, 1), (-1, -1), 8),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F3F4F6')])
    ]))
    
    elements.append(table)
    elements.append(Spacer(1, 0.5*cm))
    elements.append(Paragraph(f"Total de veículos: {len(veiculos_data)}", subtitulo_style))
    
    doc.build(elements)
    buffer.seek(0)
    return buffer

def gerar_pdf_eventos(eventos_data):
    """Gera PDF com lista de eventos"""
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=2*cm, bottomMargin=2*cm)
    elements = []
    
    titulo_style, subtitulo_style = criar_cabecalho()
    
    elements.append(Paragraph("JB Estruturas e Eventos", titulo_style))
    elements.append(Paragraph(f"Relatório de Eventos - {datetime.now().strftime('%d/%m/%Y %H:%M')}", subtitulo_style))
    elements.append(Spacer(1, 0.5*cm))
    
    data = [['Data', 'Título', 'Local', 'Horário', 'Status']]
    
    for evento in eventos_data:
        data_evento = evento.get('data_evento', '-')
        if isinstance(data_evento, str):
            try:
                data_evento = datetime.fromisoformat(data_evento).strftime('%d/%m/%Y')
            except:
                pass
        
        horario = '-'
        if evento.get('hora_inicio') and evento.get('hora_fim'):
            horario = f"{evento.get('hora_inicio')} - {evento.get('hora_fim')}"
        
        data.append([
            data_evento,
            evento.get('titulo', '-'),
            evento.get('local', '-'),
            horario,
            evento.get('status', '-').upper()
        ])
    
    table = Table(data, colWidths=[2.5*cm, 5*cm, 5*cm, 3*cm, 2.5*cm])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3B82F6')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.white),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('FONTSIZE', (0, 1), (-1, -1), 8),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F3F4F6')])
    ]))
    
    elements.append(table)
    elements.append(Spacer(1, 0.5*cm))
    elements.append(Paragraph(f"Total de eventos: {len(eventos_data)}", subtitulo_style))
    
    doc.build(elements)
    buffer.seek(0)
    return buffer
