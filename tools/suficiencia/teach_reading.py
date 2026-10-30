"""Text-grounded reading instruction; evidence is an exact substring of each passage."""
import re,unicodedata,math
from collections import Counter
from teaching_common import lesson as L,step as S

STOP=set('a al algo alguna alguno algunos ante antes asi aunque cada como con cual cuando de del desde donde el ella ello ellos en entre era es esa ese eso esta estas este esto estos fue ha hacia hasta hay la las le les lo los mas me mi mismo muy ni no nos o otra otro para pero por porque que quien se ser si sin sino sobre su sus tal tambien tanto tener todo todos tras tu un una unas uno unos y ya'.split())
def words(s):
    s=''.join(c for c in unicodedata.normalize('NFD',s.lower()) if unicodedata.category(c)!='Mn')
    return {x for x in re.findall(r'[a-z0-9]+',s) if len(x)>2 and x not in STOP}

def evidence(q,p):
    paragraphs=p['text'].split('\n\n');sentences=[]
    for n,paragraph in enumerate(paragraphs,1):
        for sentence in re.split(r'(?<=[.!?])\s+',paragraph.strip()):
            if sentence:sentences.append((n,sentence))
    target=words(q['options'][q['correct']]+' '+q['explanation']);query=words(q['text'])
    quoted=re.findall(r'«([^»]+)»|[“"]([^”"]+)[”"]',q['text'])
    terms=[''.join(x).lower() for x in quoted]
    if q['topic']=='Idea principal':
        # A main idea must account for the entire text: include both paragraphs.
        chosen=[]
        for n in range(1,len(paragraphs)+1):
            pool=[r for r in sentences if r[0]==n]
            chosen.append(max(pool,key=lambda r:len(words(r[1])&target)))
    else:
        def score(row):
            w=words(row[1]);return 3*len(w&target)+len(w&query)+20*sum(t in row[1].lower() for t in terms)
        ranked=sorted(sentences,key=score,reverse=True)
        chosen=ranked[:2]
    return sorted(set(chosen),key=lambda r:(r[0],p['text'].index(r[1])))

def explain(q,p):
    topic=q['topic'];answer=q['options'][q['correct']];proof=evidence(q,p)
    negative=bool(re.search(r'\bNO corresponde\b|sería contraria|sería incorrecta|actitud sería contraria|no puede suponerse',q['text']))
    if topic=='Idea principal':
        basics='La idea principal reúne lo más importante de toda la lectura. Un ejemplo o una definición aislada pueden ser verdaderos, pero no bastan si dejan fuera una parte central del texto.'
        task='Buscamos una idea que reúna los dos párrafos, no solo un detalle llamativo.'
        bridge='Leemos juntas las dos evidencias. '+q['explanation']
        use='La alternativa debe conservar las dos partes del argumento sin agregar una afirmación más fuerte. '+answer
        error='No elijas una opción solo porque repita palabras del primer párrafo. Comprueba que también abarque el segundo.'
        check='Vuelve a leer ambos párrafos: la respuesta debe resumirlos y conservar sus matices, no reemplazarlos por un ejemplo.'
    elif topic.startswith('Vocab'):
        basics='El significado en contexto es el que una palabra tiene en esta oración concreta. Primero leemos lo que la rodea; después probamos una sustitución que mantenga el sentido.'
        task='Buscamos qué significa la expresión aquí, no todas sus posibles definiciones.'
        bridge='La oración alrededor de la expresión nos da la pista. '+q['explanation']
        use='Probamos la interpretación propuesta dentro de esa misma oración: '+answer
        error='Una acepción del diccionario puede ser correcta en otro texto y fallar aquí. No ignores la oración completa.'
        check='Al sustituir la expresión por el significado elegido, la oración debe conservar el mensaje del pasaje.'
    elif topic=='Inferencia':
        basics='Inferir es obtener una conclusión apoyada en lo que dice el texto, aunque no aparezca escrita con las mismas palabras. No permite inventar datos ni usar conocimientos ajenos al pasaje.'
        task='Relacionamos las afirmaciones del texto para decidir qué conclusión está respaldada.'
        bridge='Unimos estas pistas sin introducir una premisa nueva. '+q['explanation']
        use='La conclusión que se puede defender con esas pistas es: '+answer
        error='No conviertas «puede» en «siempre», ni «contribuye» en «es lo único». Esos cambios hacen la conclusión más fuerte que el texto.'
        check='Intenta justificar la conclusión usando solo las frases citadas. Si requiere un dato nuevo, hay que revisarla.'
    elif topic.startswith('Relación'):
        basics='Aquí importa para qué se usa una frase, un ejemplo o un conector. Puede definir, comparar, añadir una condición o limitar una afirmación previa. Leemos qué dice antes y qué dice después.'
        task='Identificamos la función de la parte señalada dentro del argumento, no solo su tema.'
        bridge='Observamos cómo la frase se conecta con lo que la rodea. '+q['explanation']
        use='La función que conserva esa relación es: '+answer
        error='No confundas mencionar un tema con explicar la función de una frase. Pregúntate qué cambia al añadirla al texto.'
        check='Lee el fragmento junto con la frase anterior: la función elegida debe explicar por qué el autor lo incluyó allí.'
    else:
        basics='La información explícita está escrita directamente en el pasaje, aunque la alternativa pueda expresarla con otras palabras. Buscamos la oración y comparamos su significado completo.'
        task='Localizamos el dato concreto que solicita la pregunta.'
        bridge='La respuesta debe conservar lo que afirma la evidencia, sin cambiar sus condiciones. '+q['explanation']
        use='La opción que expresa ese dato es: '+answer
        error='Encontrar una palabra repetida no basta: revisa quién realiza la acción y si hay condiciones o negaciones.'
        check='Señala en el texto la oración que permite responder. La alternativa debe decir lo mismo sin añadir datos.'
    if negative:
        task+=' Atención: se pide la excepción o una afirmación contraria, así que seleccionaremos lo que el pasaje NO respalda.'
        use='Esta es la afirmación que hay que rechazar o que no se puede suponer: '+answer
        bridge=q['explanation']+' La evidencia se usa para detectar la contradicción o la falta de respaldo, no para declarar verdadera la opción marcada.'
        check='La alternativa marcada responde a una pregunta negativa. No la memorices como una afirmación del texto.'
        error='No pases por alto la negación: en esta pregunta la respuesta correcta identifica una afirmación que se rechaza.'
    steps=[S('Entendemos la tarea',task)]
    for n,text in proof:
        row=S('Buscamos la evidencia en el párrafo '+str(n),'Lee esta oración completa antes de mirar la alternativa.');row['quote']=text;row['paragraph']=n;steps.append(row)
    steps.extend([S('Explicamos la relación',bridge),S('Comparamos con la alternativa',use)])
    return L('Responder a partir del texto «'+p['title']+'».',basics,steps,error,check)
