#include<iostream>
#include<fstream>
using namespace std;

#define MAX 100 
#define FOR(i,n) for(int i=0;i<n;++i)
 
// --- trie node
struct node
{
      node* ptr[36];
      char* eng_str; //don't use statically declared arrays since not every node will have a conversion
      
      node( )
      {
            FOR(i,36) ptr[i]=NULL;
            eng_str = NULL;
      }
};

// --- Write trie to xml in dfs fashion
void write_trie(node* root, FILE* out, int spaces=0)
{
      fprintf(out,"{");
          
      if(root != NULL)
      {
          fprintf(out, "\n\"ptr\" : ["); 
          
          FOR(i,36)
          {
                if( i > 0 && i < 36)
                    fprintf(out, ", ");
                write_trie(root->ptr[i], out, spaces+2); 
          }
          fprintf(out, "\n]"); 
          
          if( root->eng_str != NULL)
          {
                 fprintf(out, ", \n \"eng_str\" : \"%s\"", root->eng_str);     
          }
      }
      else
      {
          fprintf(out,"");
      }
      fprintf(out,"}");
}

//depth first 
void print_trie(node* root, int n = -1)
{
    if(root != NULL)
    {
        if ( n != -1)
            printf("[debug] %c\n", n + 'a'); 
     
        FOR(i, 36)
        {
             print_trie(root->ptr[i], i);
        }
    }    
}

// --- Main function trains the trie 
int main()
{
node* root = new node();
FILE* in = fopen("dictionary.txt","r+");
FILE* out = fopen("trie.json","w");
      
char new_str[MAX], eng_str[MAX], str[MAX];

if(!in)
{
  std::cerr<<"Error opening the dictionary\n";
  return 1;       
}

while(fscanf(in, "%s", new_str)!=EOF)
{
        fscanf(in, "%s", eng_str);
        cout<<"[debug] "<<new_str<<", "<<eng_str<<endl;
        
        int len = strlen(new_str), index;

        node* cur = root;        

        FOR(i,len)
        {
                 if(new_str[i] >= 'a' && new_str[i] <= 'z')
                    index = new_str[i]-'a';
                 else
                    index = 26 + new_str[i] - '0';
                    
                 if((cur->ptr)[index]==NULL)
                 {
                       (cur->ptr)[index] = new node();    
                       //cout<<"pointer was not found at "<<i<<" for "<<new_str<<endl;
                       //system("Pause");                                                          
                 } 
                 
                 cur = (cur->ptr)[index]; 
                 //cout<<"[debug] "<<cur<<endl;               
        }
        
        cur->eng_str = new char[MAX];
        strcpy(cur->eng_str, eng_str);
}

print_trie(root);
write_trie(root, out);

system("pause");
return 0;    
}
